import { AvosCommand } from "./command";
import { AvosCommandHandler } from "./command-handler";
export declare class AvosCommandBus {
    private readonly handlers;
    private readonly logger;
    register(handler: AvosCommandHandler): void;
    execute(command: AvosCommand): Promise<{
        status: string;
        metadata: {
            reason: string;
            commandType: string;
        };
        data?: undefined;
    } | {
        status: string;
        data: any;
        metadata?: undefined;
    }>;
}
