import { SuppliersService } from "./suppliers.service";
export declare class SuppliersController {
    private service;
    constructor(service: SuppliersService);
    findAll(): any;
    create(dto: any): any;
}
