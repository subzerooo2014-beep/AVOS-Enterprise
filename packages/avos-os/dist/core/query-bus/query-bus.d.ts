import { AvosQuery } from "./query";
import { AvosQueryHandler } from "./query-handler";
export declare class AvosQueryBus {
    private readonly handlers;
    private readonly logger;
    register(handler: AvosQueryHandler): void;
    execute(query: AvosQuery): Promise<{
        status: string;
        reason: string;
        queryType: string;
        data?: undefined;
    } | {
        status: string;
        data: any;
        reason?: undefined;
        queryType?: undefined;
    }>;
}
