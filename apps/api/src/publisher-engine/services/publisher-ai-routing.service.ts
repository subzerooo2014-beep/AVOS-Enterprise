import { Injectable } from "@nestjs/common";
import { PublisherDecisionService } from "./publisher-decision.service";

@Injectable()
export class PublisherAiRoutingService {
  constructor(
    private readonly decision: PublisherDecisionService,
  ) {}

  route(job: any) {
    return {
      success: true,
      channel: this.decision.decide(job),
    };
  }
}
