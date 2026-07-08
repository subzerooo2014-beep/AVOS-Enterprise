import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private service;
    constructor(service: NotificationsService);
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
