import { PurchasesService } from "./purchases.service";
export declare class PurchasesController {
    private service;
    constructor(service: PurchasesService);
    findAll(): any;
    create(dto: any): any;
}
