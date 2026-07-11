import { PrismaService } from "../../prisma/prisma.service";
import { PublisherContext, PublisherResult } from "../contracts/publisher.types";
import { PublisherVehicleContextService } from "./publisher-vehicle-context.service";
import { PublisherPlatformEventService } from "./publisher-platform-event.service";
export declare class InternalPublisherRuntimeService {
    private readonly prisma;
    private readonly vehicles;
    private readonly events;
    private readonly logger;
    constructor(prisma: PrismaService, vehicles: PublisherVehicleContextService, events: PublisherPlatformEventService);
    publish(context: PublisherContext): Promise<PublisherResult>;
}
