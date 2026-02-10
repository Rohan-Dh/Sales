import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { CoreModule } from '../../core/core.module';
import AuthContract from './contract/auth.contract';
import { Permission } from '../../database/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), CoreModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthContract,
      useClass: AuthService,
    }
  ],
})
export class AuthModule {}
