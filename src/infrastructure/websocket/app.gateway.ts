import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: true,
})
export class AppGateway {

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("ping")
  ping() {
    return {
      event: "pong",
      timestamp: new Date().toISOString(),
    };
  }

  broadcast(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }
}
