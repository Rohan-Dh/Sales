import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import LeaderboardContract from './contract/leaderboard.contract';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from '../../database/entities/sales.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales])],
  controllers: [  LeaderboardController],
  providers: [
    {
      provide: LeaderboardContract,
      useClass: LeaderboardService
    }
  ]
})
export class LeaderboardModule {}