import { Injectable } from "@nestjs/common";
import { PublisherChannelResolverV2Service } from "./publisher-channel-resolver-v2.service";

@Injectable()
export class PublisherJobRouterService {
  constructor(
    private readonly resolver: PublisherChannelResolverV2Service,
  ) {}

  route(job: any) {
    return {
      jobId: job.id,
      channel: this.resolver.resolve(job),
      routedAt: new Date(),
    };
  }
}
