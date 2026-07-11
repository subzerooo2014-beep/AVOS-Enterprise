import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { BuyerMatchingRuntimeService } from "../channel-runtimes/buyer-matching-runtime.service";

@Injectable()
export class BuyerPublisher {
  readonly channel = "matched_buyers";

  constructor(
    private readonly runtime: BuyerMatchingRuntimeService,
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
