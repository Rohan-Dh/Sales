import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import LeaderboardContract from './contract/leaderboard.contract';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from '../../database/entities/sales.entity';
import { Role } from '../../database/entities/role.entity';
import { User } from '../../database/entities/user.entity';
import { Permission } from '../../database/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales, Role, Permission, User])],
  controllers: [  LeaderboardController],
  providers: [
    {
      provide: LeaderboardContract,
      useClass: LeaderboardService
    }
  ]
})
export class LeaderboardModule {}