import { QueueService } from "./queue.service";
export declare class QueueController {
    private service;
    constructor(service: QueueService);
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
