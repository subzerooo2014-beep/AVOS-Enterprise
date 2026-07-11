import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { InternalPublisherRuntimeService } from "../channel-runtimes/internal-publisher-runtime.service";

@Injectable()
export class InternalPublisher {
  readonly channel = "internal";

  constructor(
    private readonly runtime: InternalPublisherRuntimeService,
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
