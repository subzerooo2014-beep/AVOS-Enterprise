import { ApprovalsService } from "./approvals.service";
export declare class ApprovalsController {
    private service;
    constructor(service: ApprovalsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
