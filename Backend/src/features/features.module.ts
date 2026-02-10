import { Module } from '@nestjs/common';
import { SalesModule } from './sales/sales.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ SalesModule, LeaderboardModule, AuthModule],
  exports: [ SalesModule, AuthModule],
})
export class FeaturesModule {}
