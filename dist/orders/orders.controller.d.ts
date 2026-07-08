import { OrdersService } from "./orders.service";
export declare class OrdersController {
    private service;
    constructor(service: OrdersService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
