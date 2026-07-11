import { QueryBusService } from "./query-bus.service";
import { AvosQuery } from "./query.interface";
export declare class QueryBusController {
    private readonly queryBus;
    constructor(queryBus: QueryBusService);
    execute(query: AvosQuery): Promise<any>;
}
