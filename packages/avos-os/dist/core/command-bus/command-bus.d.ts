import { AvosCommand } from "./command";
import { AvosCommandHandler } from "./command-handler";
export declare class AvosCommandBus {
    private readonly handlers;
    private readonly logger;
    register(handler: AvosCommandHandler): void;
    execute(command: AvosCommand): Promise<{
        status: string;
        reason: string;
        commandType: string;
        data?: undefined;
    } | {
        status: string;
        data: any;
        reason?: undefined;
        commandType?: undefined;
    }>;
}
