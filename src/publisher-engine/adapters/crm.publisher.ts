import { Injectable } from "@nestjs/common";

import {
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "../contracts/publisher.types";

import { CrmPublisherRuntimeService } from "../channel-runtimes/crm-publisher-runtime.service";

@Injectable()
export class CrmPublisher {
  readonly channel = "crm_leads";

  constructor(
    private readonly runtime: CrmPublisherRuntimeService,
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
