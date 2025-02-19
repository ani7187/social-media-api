import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class FriendRequestRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  // Function to find a pending friend request
  async findPendingRequest(senderId: number, receiverId: number): Promise<any> {
    const query =
      'SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = $3';
    const result = await this.pool.query(query, [
      senderId,
      receiverId,
      'pending',
    ]);
    return result.rows[0];
  }

  async createRequest(
    sender_id: number,
    receiver_id: number,
    status: string = 'pending',
  ): Promise<void> {
    const query = `
      INSERT INTO friend_requests (sender_id, receiver_id, status) 
      VALUES ($1, $2, $3);
    `;
    const params = [sender_id, receiver_id, status];

    try {
      await this.pool.query(query, params);
    } catch {
      throw new Error('Error while creating friend request');
    }
  }

  // Function to update the status of a friend request
  async updateRequestStatus(
    senderId: number,
    receiverId: number,
    status: string,
  ): Promise<void> {
    const query =
      'UPDATE friend_requests SET status = $1 WHERE sender_id = $2 AND receiver_id = $3';
    await this.pool.query(query, [status, senderId, receiverId]);
  }

  // Function to create friendship records
  async createFriendship(senderId: number, receiverId: number): Promise<void> {
    const query = `
      INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)
    `;
    await this.pool.query(query, [senderId, receiverId]);
  }

  async findFriend(userId: number, friendId: number): Promise<object> {
    const query =
      'SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2 AND status = $3';
    const result = await this.pool.query(query, [
      userId,
      friendId,
    ]);

    return result.rows[0];
  }
}
