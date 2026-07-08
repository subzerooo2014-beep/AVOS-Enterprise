import { AiagentsService } from "./aiagents.service";
export declare class AiagentsController {
    private service;
    constructor(service: AiagentsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
