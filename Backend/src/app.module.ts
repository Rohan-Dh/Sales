import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeaturesModule } from './features/features.module';
import { CoreModule } from './core/core.module';
import { GuardsModule } from './common/guards/guards.module';
import IndexConfig from './config/index.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: IndexConfig,
    }),
    FeaturesModule,
    CoreModule,
    GuardsModule,
  ],
})
export class AppModule {}
