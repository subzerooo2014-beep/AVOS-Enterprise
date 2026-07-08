import { MultitenancyService } from "./multitenancy.service";
export declare class MultitenancyController {
    private service;
    constructor(service: MultitenancyService);
    findAll(): never[];
    create(dto: any): any;
}
