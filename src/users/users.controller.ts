import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() user: Omit<User, 'id'>): Promise<User> {
    return this.usersService.create(user);
  }

  @Get('search')
  async advancedSearch(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('age') age?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<User[]> {
    const ageNumber = age ? parseInt(age, 10) : undefined;

    return await this.usersService.search(
      firstName,
      lastName,
      ageNumber,
      page,
      limit,
    );
  }
}
