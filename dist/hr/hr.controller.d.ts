import { HrService } from "./hr.service";
export declare class HrController {
    private service;
    constructor(service: HrService);
    findAll(): any;
    create(dto: any): any;
}
