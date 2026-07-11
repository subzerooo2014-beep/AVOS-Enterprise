import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { GoogleSearchPublisherRuntimeService } from "../social-runtimes/google-search-publisher-runtime.service";

@Injectable()
export class GoogleSearchPublisher {
  readonly channel =
    "google_search";

  constructor(
    private readonly runtime: GoogleSearchPublisherRuntimeService,
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
