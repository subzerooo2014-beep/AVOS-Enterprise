import { WorkflowsService } from "./workflows.service";
export declare class WorkflowsController {
    private service;
    constructor(service: WorkflowsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
