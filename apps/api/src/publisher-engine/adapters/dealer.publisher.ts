import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { DealerPublisherRuntimeService } from "../channel-runtimes/dealer-publisher-runtime.service";

@Injectable()
export class DealerPublisher {
  readonly channel = "dealer_network";

  constructor(
    private readonly runtime: DealerPublisherRuntimeService,
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
