import { PromptsService } from "./prompts.service";
export declare class PromptsController {
    private service;
    constructor(service: PromptsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
