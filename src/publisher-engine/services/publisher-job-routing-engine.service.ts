import { Injectable } from "@nestjs/common";
import { PublisherJobRouterService } from "./publisher-job-router.service";
import { PublisherJobRoutePolicyService } from "./publisher-job-route-policy.service";
import { PublisherJobRouteResultService } from "./publisher-job-route-result.service";

@Injectable()
export class PublisherJobRoutingEngineService {
  constructor(
    private readonly router: PublisherJobRouterService,
    private readonly policy: PublisherJobRoutePolicyService,
    private readonly result: PublisherJobRouteResultService,
  ) {}

  route(job: any) {
    const routed = this.router.route(job);
    const allowed = this.policy.allow(routed.channel);
    return this.result.result(job, routed.channel, allowed);
  }
}
