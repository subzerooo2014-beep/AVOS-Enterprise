import { TransactionsService } from "./transactions.service";
export declare class TransactionsController {
    private service;
    constructor(service: TransactionsService);
    findAll(): any;
    create(dto: any): any;
}
