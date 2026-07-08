import { AutomationService } from "./automation.service";
export declare class AutomationController {
    private service;
    constructor(service: AutomationService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
