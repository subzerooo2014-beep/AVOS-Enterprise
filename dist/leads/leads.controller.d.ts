import { LeadsService } from "./leads.service";
export declare class LeadsController {
    private service;
    constructor(service: LeadsService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
