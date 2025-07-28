import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  handleConnection(client: Socket) {
    this.logger.log(`클라이언트 연결됨: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 연결 해제됨: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    this.logger.log(`메시지 받음: ${data} from ${client.id}`);

    // 메시지를 보낸 클라이언트에게 응답
    client.emit('response', `서버에서 받은 메시지: ${data}`);

    // 모든 클라이언트에게 브로드캐스트
    this.server.emit('broadcast', `${client.id}님이 메시지를 보냈습니다: ${data}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    void client.join(room);
    this.logger.log(`클라이언트 ${client.id}가 방 ${room}에 입장했습니다`);
    client.emit('joined-room', `방 ${room}에 입장했습니다`);
    client.to(room).emit('user-joined', `${client.id}님이 방에 입장했습니다`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    void client.leave(room);
    this.logger.log(`클라이언트 ${client.id}가 방 ${room}에서 나갔습니다`);
    client.emit('left-room', `방 ${room}에서 나갔습니다`);
    client.to(room).emit('user-left', `${client.id}님이 방에서 나갔습니다`);
  }

  @SubscribeMessage('room-message')
  handleRoomMessage(@MessageBody() data: { room: string; message: string }, @ConnectedSocket() client: Socket): void {
    this.logger.log(`방 메시지: ${data.message} to room ${data.room} from ${client.id}`);
    client.to(data.room).emit('room-message', {
      sender: client.id,
      message: data.message,
      room: data.room,
    });
  }
}
