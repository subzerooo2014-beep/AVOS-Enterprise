import { MemoryService } from "./memory.service";
export declare class MemoryController {
    private service;
    constructor(service: MemoryService);
    findAll(): never[];
    create(dto: any): any;
}
