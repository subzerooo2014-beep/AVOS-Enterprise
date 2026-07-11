import { PrismaService } from "../../prisma/prisma.service";
import { AvosQuery } from "./query.interface";
import { QueryHandler } from "./query-handler.interface";
export declare class QueryBusService {
    private readonly prisma;
    private handlers;
    constructor(prisma: PrismaService);
    register(handler: QueryHandler): void;
    execute(query: AvosQuery): Promise<any>;
    private logQuery;
}
