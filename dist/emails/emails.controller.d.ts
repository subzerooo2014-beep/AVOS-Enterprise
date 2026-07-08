import { EmailsService } from "./emails.service";
export declare class EmailsController {
    private service;
    constructor(service: EmailsService);
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
