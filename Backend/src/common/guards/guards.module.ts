import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../database/entities/role.entity';
import { Permission } from '../../database/entities/permission.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { RoleGuard } from './role/role.guard';
import { PermissionGuard } from './permission/permission.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secretKey'),
      }),
    }),
    TypeOrmModule.forFeature([Role, Permission]),
  ],
  providers: [
    {
      provide: APP_GUARD, useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD, useClass: RoleGuard,
    },
    {
      provide: APP_GUARD, useClass: PermissionGuard,
    }
  ],
  exports: [JwtModule]
})
export class GuardsModule {}
