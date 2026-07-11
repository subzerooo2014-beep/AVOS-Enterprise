import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { InstagramPublisherRuntimeService } from "../social-runtimes/instagram-publisher-runtime.service";

@Injectable()
export class InstagramPublisher {
  readonly channel =
    "instagram";

  constructor(
    private readonly runtime: InstagramPublisherRuntimeService,
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
