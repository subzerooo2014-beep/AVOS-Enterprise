import { ClaimsService } from "./claims.service";
export declare class ClaimsController {
    private service;
    constructor(service: ClaimsService);
    findAll(): any;
    create(dto: any): any;
}
