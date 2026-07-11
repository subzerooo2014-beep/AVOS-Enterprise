import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { PublisherVehicleContextService } from "../channel-runtimes/publisher-vehicle-context.service";

import { BaseSocialPublisherRuntime } from "./base-social-publisher-runtime";
import { SocialContentBuilderService } from "./social-content-builder.service";
import { SocialPublicationEventService } from "./social-publication-event.service";

@Injectable()
export class TikTokPublisherRuntimeService
  extends BaseSocialPublisherRuntime
{
  protected readonly channel =
    "tiktok";

  protected readonly logger =
    new Logger(
      TikTokPublisherRuntimeService.name,
    );

  constructor(
    prisma: PrismaService,
    vehicles: PublisherVehicleContextService,
    contentBuilder: SocialContentBuilderService,
    publicationEvents: SocialPublicationEventService,
  ) {
    super(
      prisma,
      vehicles,
      contentBuilder,
      publicationEvents,
    );
  }
}
