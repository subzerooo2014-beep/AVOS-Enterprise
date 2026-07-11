import { PrismaService } from "../../prisma/prisma.service";
import { AvosEvent } from "../contracts/avos-event.interface";
import { EventSubscriber } from "./event-subscriber.interface";
export declare class VehicleCreatedSubscriber implements EventSubscriber {
    private prisma;
    constructor(prisma: PrismaService);
    supports(event: AvosEvent): boolean;
    handle(event: AvosEvent): Promise<void>;
}
