import { Module } from '@nestjs/common';
import { SalesModule } from './sales/sales.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [ SalesModule, LeaderboardModule],
  exports: [ SalesModule],
})
export class FeaturesModule {}
