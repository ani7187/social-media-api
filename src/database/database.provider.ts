import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_POOL',
    useFactory: async (configService: ConfigService) => {
      return new Pool({
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        user: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
      });
    },
    inject: [ConfigService],
  },
];
