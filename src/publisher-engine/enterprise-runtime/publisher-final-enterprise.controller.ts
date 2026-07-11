import {
  Controller,
  Get,
} from "@nestjs/common";

import { PublisherFinalEnterpriseService } from "./publisher-final-enterprise.service";

@Controller(
  "publisher-engine/enterprise/final",
)
export class PublisherFinalEnterpriseController {
  constructor(
    private readonly service:
      PublisherFinalEnterpriseService,
  ) {}

  @Get("live")
  live() {
    return this.service.liveMetrics();
  }

  @Get("health")
  health() {
    return this.service.operationsHealth();
  }

  @Get("executive-summary")
  executiveSummary() {
    return this.service.executiveSummary();
  }

  @Get("production-readiness")
  productionReadiness() {
    return this.service.productionReadiness();
  }

  @Get("report")
  report() {
    return this.service.finalReport();
  }
}
