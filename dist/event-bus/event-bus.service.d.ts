import { PrismaService } from "../prisma/prisma.service";
import { EventDispatcherService } from "./dispatcher/event-dispatcher.service";
import { AvosEvent } from "./contracts/avos-event.interface";
export declare class EventBusService {
    private prisma;
    private dispatcher;
    constructor(prisma: PrismaService, dispatcher: EventDispatcherService);
    publish(type: string, payload?: any): Promise<any>;
    emit(data: AvosEvent): Promise<any>;
    list(status?: string): any;
    markProcessed(id: string, result?: any): Promise<any>;
}
