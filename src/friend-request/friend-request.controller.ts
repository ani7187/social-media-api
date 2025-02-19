import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Post('send')
  async sendFriendRequest(
    @Body('receiver_id') receiver_id: number,
    @Request() req: any,
  ) {
    return this.friendRequestService.sendFriendRequest(
      req.user.sub,
      receiver_id,
    );
  }

  @Post('accept')
  async acceptFriendRequest(
    @Body('sender_id') sender_id: number,
    @Request() req: any,
  ) {
    return this.friendRequestService.acceptFriendRequest(
      req.user.sub,
      sender_id,
    );
  }

  @Post('decline')
  async declineFriendRequest(
    @Body('sender_id') sender_id: number,
    @Request() req: any,
  ) {
    return this.friendRequestService.declineFriendRequest(
      req.user.sub,
      sender_id,
    );
  }
}
