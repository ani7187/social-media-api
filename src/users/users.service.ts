import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async create(user: Omit<User, 'id'>): Promise<User> {
    const { firstName, lastName, age, email, password } = user;

    if (!firstName || !lastName || !email || !password) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'All fields are required.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this.pool.query(
        'INSERT INTO users (firstName, lastName, age, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [firstName, lastName, age, email, hashedPassword],
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Email already exists.',
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while creating the user.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0];
  }

  async search(
    firstName?: string,
    lastName?: string,
    age?: number,
    page = 1,
    limit = 10,
  ): Promise<User[]> {
    let query =
      'SELECT id, firstname, lastname, age, email FROM users WHERE 1=1';
    const params = [];

    if (firstName) {
      query += ' AND firstName ILIKE $1';
      params.push(`%${firstName}%`);
    }
    if (lastName) {
      query += ' AND lastName ILIKE $2';
      params.push(`%${lastName}%`);
    }
    if (age) {
      query += ' AND age = $3';
      params.push(age);
    }

    const start = (page - 1) * limit;
    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit);
    params.push(start);

    const result = await this.pool.query(query, params);
    return result.rows;
  }
}
