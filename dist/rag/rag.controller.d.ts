import { RagService } from "./rag.service";
export declare class RagController {
    private service;
    constructor(service: RagService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
