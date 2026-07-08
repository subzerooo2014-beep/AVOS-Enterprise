import { AuditService } from "./audit.service";
export declare class AuditController {
    private service;
    constructor(service: AuditService);
    findAll(): never[];
    findOne(id: string): {
        id: string;
    };
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        deleted: boolean;
        id: string;
    };
}
