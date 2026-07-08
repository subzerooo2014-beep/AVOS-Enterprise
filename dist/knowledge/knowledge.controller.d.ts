import { KnowledgeService } from "./knowledge.service";
export declare class KnowledgeController {
    private service;
    constructor(service: KnowledgeService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
