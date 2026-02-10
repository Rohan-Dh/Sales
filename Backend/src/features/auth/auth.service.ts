import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import AuthContract from './contract/auth.contract';
import { User } from "src/database/entities/user.entity";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { createClient } from 'redis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SessionData } from './interface/session-data.interface';
import { createHash, randomBytes } from 'node:crypto';
import { CustomJwtService } from '../../core/jwt/jwt.service';
import { RolesEnum } from '../../common/enum/role.enum';
import { Role } from '../../database/entities/role.entity';
import { UserDetailsDto } from './dto/user-details.dto';

type ClientRedis = ReturnType<typeof createClient>;

@Injectable()
export class AuthService extends AuthContract {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: ClientRedis,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly jwtService: CustomJwtService,
  ) {
    super();
  }

  private makeRefreshToken() {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return { token, tokenHash };
  }

  async login(
    data: UserLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let email = data.email;
    const password = data.password;

    email = email.trim().toLowerCase();

    const attemptsKey = `login_attempts:${email}`;

    const user = await this.userRepo.findOne({
      where: { email },
      relations: { roles: true },
      select: {
        id: true,
        email: true,
        password: true,
        isActive: true,
        name: true,
      },
    });

    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : false;

    const canLogin = user && validPassword && user.isActive;

    if (!canLogin) {
      const attemptCount = await this.redis.incr(attemptsKey);
      if (attemptCount === 1) await this.redis.expire(attemptsKey, 900);

      if (attemptCount >= 5) {
        throw new UnauthorizedException('Too many attempts. Try again later.');
      }

      const remainingCount = Math.max(0, 5 - attemptCount);
      throw new UnauthorizedException(
        `Invalid credentials or account issues. ${remainingCount} attempt remaining.`,
      );
    }

    await this.redis.del(attemptsKey);

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
    };
    const accessToken = await this.jwtService.getAccessToken(payload);

    const { token, tokenHash } = this.makeRefreshToken();
    const sessionInfo: SessionData = {
      userId: user.id,
    };
    await this.redis.set(`refresh:${tokenHash}`, JSON.stringify(sessionInfo), {
      EX: 7 * 24 * 60 * 60,
    });

    const userSessionsKey = `user_sessions:${user.id}`;
    await this.redis.sAdd(userSessionsKey, tokenHash);
    await this.redis.expire(userSessionsKey, 7 * 24 * 60 * 60);

    return { accessToken, refreshToken: token };
  }

  async signup(
    data: UserRegisterDto,
    isAdmin?: boolean,
  ): Promise<UserDetailsDto> {
    const { firstName, lastName, password, confirmPassword } = data;

    let email = data.email;
    email = email.trim().toLowerCase();

    if (password !== confirmPassword)
      throw new BadRequestException('Password mismatch');

    try {
      let user = await this.userRepo.findOne({
        where: { email },
      });

      if (user) {
        throw new BadRequestException('Email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let role: Role[] | null = null;

      user = this.userRepo.create({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
      });

      if (isAdmin) {
        role = await this.roleRepo.findBy({ name: RolesEnum.ADMIN });
        if (role.length < 1)
          throw new BadRequestException('Role does not exist');
        user.roles = role;

        await this.userRepo.save(user);
        return {
          name: user.name,
          email: user.email,
        };
      }

      role = await this.roleRepo.findBy({ name: RolesEnum.AGENT });
      if (role.length < 1) throw new BadRequestException('Role does not exist');
      user.roles = role;

      await this.userRepo.save(user);
      return {
        name: user.name,
        email: user.email,
      };
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new BadRequestException('Email already exists');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Register failed');
    }
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const oldHash = createHash('sha256').update(refreshToken).digest('hex');
    const oldKey = `refresh:${oldHash}`;

    const data = await this.redis.get(oldKey);
    if (!data) throw new UnauthorizedException('Invalid refresh token');

    const sessionData: SessionData = JSON.parse(data);

    await this.redis.del(oldKey);

    const userSessionsKey = `user_sessions:${sessionData.userId}`;
    await this.redis.sRem(userSessionsKey, oldHash);

    const user = await this.userRepo.findOne({
      where: { id: sessionData.userId },
      relations: ['roles'],
    });

    if (!user) throw new UnauthorizedException();

    const accessToken = await this.jwtService.getAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
    });

    const { token, tokenHash } = this.makeRefreshToken();

    await this.redis.set(
      `refresh:${tokenHash}`,
      JSON.stringify({ userId: user.id }),
      {
        EX: 7 * 24 * 60 * 60,
      },
    );

    await this.redis.sAdd(userSessionsKey, tokenHash);
    await this.redis.expire(userSessionsKey, 7 * 24 * 60 * 60);

    return { accessToken, refreshToken: token };
  }

}
