import { PaymentsService } from "./payments.service";
export declare class PaymentsController {
    private service;
    constructor(service: PaymentsService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
