import { ContractsService } from "./contracts.service";
export declare class ContractsController {
    private service;
    constructor(service: ContractsService);
    findAll(): any;
    create(dto: any): any;
}
