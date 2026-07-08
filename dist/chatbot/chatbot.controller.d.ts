import { ChatbotService } from "./chatbot.service";
export declare class ChatbotController {
    private service;
    constructor(service: ChatbotService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
