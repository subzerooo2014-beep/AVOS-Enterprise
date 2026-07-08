import { TemplatesService } from "./templates.service";
export declare class TemplatesController {
    private service;
    constructor(service: TemplatesService);
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
