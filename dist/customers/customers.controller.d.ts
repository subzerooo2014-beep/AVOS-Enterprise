import { CustomersService } from "./customers.service";
export declare class CustomersController {
    private service;
    constructor(service: CustomersService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
