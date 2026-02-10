import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
  }
  public async getAccessToken(
    payload: any,
    expiresIn?: number | null
  ): Promise<string> {
    const at = await this.jwtService.signAsync(
      {...payload},
      {
        secret: this.config.get<string>('jwt.secretKey'),
        expiresIn: expiresIn ?? this.config.get<number>('jwt.expiry'),
      },
    );
    return at;
  }
}
