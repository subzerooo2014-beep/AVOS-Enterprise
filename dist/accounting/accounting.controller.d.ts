import { AccountingService } from "./accounting.service";
export declare class AccountingController {
    private service;
    constructor(service: AccountingService);
    findAll(): any;
    create(dto: any): any;
}
