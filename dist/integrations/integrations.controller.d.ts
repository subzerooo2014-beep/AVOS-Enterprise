import { IntegrationsService } from "./integrations.service";
export declare class IntegrationsController {
    private service;
    constructor(service: IntegrationsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
