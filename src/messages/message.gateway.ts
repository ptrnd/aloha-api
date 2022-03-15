import {
  ClassSerializerInterceptor,
  Inject,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserJwtPayload } from 'src/auth/auth.dto';
import { MessageEntity } from 'src/core/repository/message/message.entity';
import { UserEntity } from 'src/core/repository/user/user.entity';
import { USER_REPOSITORY } from 'src/core/repository/user/user.module';
import { Repository } from 'typeorm';
import { MessageResponseDto } from './message.dto';
@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
  namespace: 'messages',
})
@UseInterceptors(ClassSerializerInterceptor)
export class MessageGateway {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: Repository<UserEntity>,
  ) {}

  sendMessage(data: MessageResponseDto) {
    const agentId = data.agent !== undefined ? data.agent.id.toString() : '0';
    this.server
      .to(`message:${agentId}`)
      .to('message:admin')
      .emit('message', data);
  }

  @SubscribeMessage('join')
  async handleUserJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string,
  ) {
    const payload: UserJwtPayload = JSON.parse(data);
    const user = await this.userRepository.findOne(payload.id);
    if (user === undefined) {
      return 'User not found';
    }

    if (user.role == 'admin') {
      socket.join('message:admin');
      return 'Admin joined the message';
    }

    socket.join('message:' + user.id);
    return 'Agent ' + user.full_name + ' joined the message';
  }

  @WebSocketServer()
  server: Server;
}
