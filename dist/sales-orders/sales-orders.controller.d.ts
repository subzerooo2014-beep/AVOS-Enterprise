import { SalesOrdersService } from "./sales-orders.service";
export declare class SalesOrdersController {
    private readonly service;
    constructor(service: SalesOrdersService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
}
