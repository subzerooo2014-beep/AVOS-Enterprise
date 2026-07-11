import { AvosEvent } from "./event";
import { AvosEventHandler } from "./event-handler";
export declare class AvosEventBus {
    private readonly handlers;
    private readonly logger;
    register(handler: AvosEventHandler): void;
    publish(event: AvosEvent): Promise<{
        status: string;
        reason: string;
        eventType: string;
        handlers?: undefined;
    } | {
        status: string;
        handlers: number;
        eventType: string;
        reason?: undefined;
    }>;
}
