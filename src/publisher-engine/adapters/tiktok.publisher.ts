import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { TikTokPublisherRuntimeService } from "../social-runtimes/tiktok-publisher-runtime.service";

@Injectable()
export class TikTokPublisher {
  readonly channel =
    "tiktok";

  constructor(
    private readonly runtime: TikTokPublisherRuntimeService,
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
