import { WebhooksService } from "./webhooks.service";
export declare class WebhooksController {
    private service;
    constructor(service: WebhooksService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
