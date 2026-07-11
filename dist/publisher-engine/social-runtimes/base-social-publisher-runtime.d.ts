import { Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublisherContext, PublisherResult } from "../contracts/publisher.types";
import { PublisherVehicleContextService } from "../channel-runtimes/publisher-vehicle-context.service";
import { SocialContentBuilderService } from "./social-content-builder.service";
import { SocialPublicationEventService } from "./social-publication-event.service";
export declare abstract class BaseSocialPublisherRuntime {
    protected readonly prisma: PrismaService;
    protected readonly vehicles: PublisherVehicleContextService;
    protected readonly contentBuilder: SocialContentBuilderService;
    protected readonly publicationEvents: SocialPublicationEventService;
    protected abstract readonly channel: string;
    protected abstract readonly logger: Logger;
    constructor(prisma: PrismaService, vehicles: PublisherVehicleContextService, contentBuilder: SocialContentBuilderService, publicationEvents: SocialPublicationEventService);
    publish(context: PublisherContext): Promise<PublisherResult>;
}
