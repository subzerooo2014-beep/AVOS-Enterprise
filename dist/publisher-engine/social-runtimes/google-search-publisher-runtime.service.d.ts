import { Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublisherVehicleContextService } from "../channel-runtimes/publisher-vehicle-context.service";
import { BaseSocialPublisherRuntime } from "./base-social-publisher-runtime";
import { SocialContentBuilderService } from "./social-content-builder.service";
import { SocialPublicationEventService } from "./social-publication-event.service";
export declare class GoogleSearchPublisherRuntimeService extends BaseSocialPublisherRuntime {
    protected readonly channel = "google_search";
    protected readonly logger: Logger;
    constructor(prisma: PrismaService, vehicles: PublisherVehicleContextService, contentBuilder: SocialContentBuilderService, publicationEvents: SocialPublicationEventService);
}
