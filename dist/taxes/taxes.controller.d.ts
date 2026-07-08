import { TaxesService } from "./taxes.service";
export declare class TaxesController {
    private service;
    constructor(service: TaxesService);
    findAll(): any;
    create(dto: any): any;
}
