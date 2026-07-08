import { JobsService } from "./jobs.service";
export declare class JobsController {
    private service;
    constructor(service: JobsService);
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
