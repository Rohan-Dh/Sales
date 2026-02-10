import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { UserRegisterDto } from './dto/user-register.dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLoginDto } from './dto/user-login.dto';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../config/cookie.config';
import { User } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AuthContract from './contract/auth.contract';
import { UserDetailsDto } from './dto/user-details.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly auth: AuthContract,
  ) {}

  @ApiOperation({ summary: 'Refresh access token using refreshToken cookie' })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid refresh token' })
  @ApiCookieAuth('refreshToken')
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken: string | undefined = req.cookies?.refreshToken;

    console.log(oldRefreshToken);

    if (!oldRefreshToken)
      throw new UnauthorizedException('Missing refresh token');

    const { accessToken, refreshToken } =
      await this.auth.refresh(oldRefreshToken);

    res.cookie('accessToken', accessToken, accessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions());

    return { success: true };
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Logged in successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({
    description: 'please provide required credentials',
  })
  @Post('login')
  async login(
    @Body() body: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.auth.login(body);

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions());
    res.cookie('accessToken', accessToken, accessTokenCookieOptions());

    return { success: true };
  }

  @ApiOperation({ summary: 'Agent use this api endpoint for signup' })
  @ApiOkResponse({ description: 'User created', type: UserDetailsDto })
  @ApiBadRequestResponse({
    description: 'please provide a required credentials',
  })
  @Post('signup')
  async Register(@Body() body: UserRegisterDto) {
    const data: UserDetailsDto = await this.auth.signup(body, false);
    return data;
  }

  @ApiOperation({ summary: 'Admin use this api endpoint for signup' })
  @ApiOkResponse({ description: 'Admin created', type: UserDetailsDto })
  @ApiBadRequestResponse({
    description: 'please provide a required credentials',
  })
  @Post('admin-signup')
  async AdminRegister(@Body() body: UserRegisterDto) {
    const data: UserDetailsDto = await this.auth.signup(body, true);
    return data;
  }

  @ApiOperation({ summary: 'Logout (removes refresh token + clears cookies)' })
  @ApiOkResponse({ description: 'Logged out' })
  @ApiUnauthorizedResponse({ description: 'Missing refresh token' })
  @ApiCookieAuth('refreshToken')
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('accessToken', accessTokenCookieOptions());
    res.clearCookie('refreshToken', refreshTokenCookieOptions());

    return { success: true };
  }
}
