import { PrismaService } from "../../prisma/prisma.service";
import { PublisherPlatformEventService } from "../channel-runtimes/publisher-platform-event.service";
export declare class SocialPublicationEventService {
    private readonly prisma;
    private readonly events;
    private readonly logger;
    constructor(prisma: PrismaService, events: PublisherPlatformEventService);
    createOrRefresh(input: {
        channel: string;
        vehicleId: string;
        payload: any;
        correlationId?: string | null;
    }): Promise<{
        eventId: string;
        operation: "created" | "refreshed";
        status: string;
    }>;
    private eventType;
}
