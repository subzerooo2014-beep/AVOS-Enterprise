import { EmbeddingsService } from "./embeddings.service";
export declare class EmbeddingsController {
    private service;
    constructor(service: EmbeddingsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
