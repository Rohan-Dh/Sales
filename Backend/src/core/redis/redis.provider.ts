import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const url =
      config.get<string>('redis.url') ||
      config.get<string>('REDIS_URL') ||
      'redis://localhost:6379';

    const client = createClient({ url });

    client.on('error', (err) => console.log('Redis Error: ', err));

    await client.connect();

    console.log(`
redis connected successfully
url: ${url}`);

    return client;
  },
};
