import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { databaseProviders } from './database/database.provider';
import { AuthModule } from './auth/auth.module';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    FriendRequestModule,
  ],
  controllers: [],
  providers: [...databaseProviders],
})
export class AppModule {}
