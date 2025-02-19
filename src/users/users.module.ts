import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { databaseProviders } from '../database/database.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...databaseProviders],
  exports: [UsersService],
})
export class UsersModule {}
