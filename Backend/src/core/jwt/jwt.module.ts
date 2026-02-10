import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomJwtService } from './jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secretKey'),
        signOptions: {
          expiresIn: config.getOrThrow<number>('jwt.expiry'),
        },
      }),
    }),
  ],
  providers: [CustomJwtService],
  exports: [CustomJwtService, JwtModule],
})
export class CustomJwtModule {}
