import { RulesService } from "./rules.service";
export declare class RulesController {
    private service;
    constructor(service: RulesService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
