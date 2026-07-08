import { ApiService } from "./api.service";
export declare class ApiController {
    private service;
    constructor(service: ApiService);
    findAll(): never[];
    create(dto: any): any;
}
