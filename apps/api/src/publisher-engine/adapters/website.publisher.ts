import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { WebsitePublishingService } from "../website-runtime/website-publishing.service";

@Injectable()
export class WebsitePublisher {
  readonly channel = "website";

  constructor(
    private readonly runtime: WebsitePublishingService,
  ) {}

  async health(): Promise<PublisherStatus> {
    return "healthy";
  }

  publish(
    context: PublisherContext,
  ): Promise<PublisherResult> {
    return this.runtime.publish(context);
  }
}
