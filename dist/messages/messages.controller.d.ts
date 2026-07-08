import { MessagesService } from "./messages.service";
export declare class MessagesController {
    private service;
    constructor(service: MessagesService);
    findAll(): any;
    create(dto: any): any;
}
