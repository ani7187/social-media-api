import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequestRepository } from './friend-request.repository';

@Injectable()
export class FriendRequestService {
  constructor(private friendRequestRepository: FriendRequestRepository) {}

  async sendFriendRequest(sender_id: number, receiver_id: number) {
    await this.validateSendRequest(sender_id, receiver_id);

    await this.friendRequestRepository.createRequest(
      sender_id,
      receiver_id,
      'pending',
    );

    return { message: 'Friend request sent successfully' };
  }

  async acceptFriendRequest(sender_id: number, receiver_id: number) {
    await this.validateAcceptRequest(sender_id, receiver_id);

    await this.friendRequestRepository.updateRequestStatus(
      sender_id,
      receiver_id,
      'accepted',
    );

    await this.friendRequestRepository.createFriendship(sender_id, receiver_id);

    return { message: 'Friend request accepted' };
  }

  async declineFriendRequest(receiver_id: number, sender_id: number) {
    await this.validateDeclineRequest(sender_id, receiver_id);

    await this.friendRequestRepository.updateRequestStatus(
      sender_id,
      receiver_id,
      'declined',
    );

    return { message: 'Friend request declined' };
  }

  async getFriendRequestsList(receiver_id: number) {
    return await this.friendRequestRepository.findFriendRequestsList(
      receiver_id,
    );
  }

  private async validateSendRequest(senderId: number, receiverId: number) {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Missing sender or receiver id');
    }
    const existingFriend = this.friendRequestRepository.findFriend(
      senderId,
      receiverId,
    );
    if (existingFriend) {
      throw new BadRequestException('Friendship already exist');
    }

    const existingRequest =
      await this.friendRequestRepository.findPendingRequest(
        senderId,
        receiverId,
      );

    if (existingRequest) {
      throw new BadRequestException('Friend request already pending');
    }
  }

  private async validateAcceptRequest(senderId: number, receiverId: number) {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Missing sender or receiver id');
    }
    const request = await this.friendRequestRepository.findPendingRequest(
      senderId,
      receiverId,
    );

    if (!request) {
      throw new NotFoundException(
        'Friend request not found or already processed',
      );
    }
  }

  private async validateDeclineRequest(senderId: number, receiverId: number) {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Missing sender or receiver id');
    }
    const request = await this.friendRequestRepository.findPendingRequest(
      senderId,
      receiverId,
    );

    if (!request) {
      throw new NotFoundException(
        'Friend request not found or already processed',
      );
    }
  }
}
