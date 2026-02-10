import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { CustomJwtModule } from './jwt/jwt.module';

@Module({
  imports: [DatabaseModule, RedisModule, CustomJwtModule],
  exports: [DatabaseModule, RedisModule, CustomJwtModule]
})
export class CoreModule {}
