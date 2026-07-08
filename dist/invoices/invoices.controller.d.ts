import { InvoicesService } from "./invoices.service";
export declare class InvoicesController {
    private service;
    constructor(service: InvoicesService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
