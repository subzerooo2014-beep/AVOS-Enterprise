import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { ExportPublisherRuntimeService } from "../channel-runtimes/export-publisher-runtime.service";

@Injectable()
export class ExportPublisher {
  readonly channel = "gcc_export";

  constructor(
    private readonly runtime: ExportPublisherRuntimeService,
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
