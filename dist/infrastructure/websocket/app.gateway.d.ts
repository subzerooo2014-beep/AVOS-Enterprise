import { Server } from "socket.io";
export declare class AppGateway {
    server: Server;
    ping(): {
        event: string;
        timestamp: string;
    };
    broadcast(event: string, payload: unknown): void;
}
