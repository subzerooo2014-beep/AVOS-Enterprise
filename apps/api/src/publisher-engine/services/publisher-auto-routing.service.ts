import { Injectable } from "@nestjs/common";
import { PublisherDecisionService } from "./publisher-decision.service";

@Injectable()
export class PublisherAutoRoutingService {
  constructor(
    private readonly decision: PublisherDecisionService,
  ) {}

  route(job: any) {
    return {
      channel: this.decision.decide(job),
      generatedAt: new Date(),
    };
  }
}
