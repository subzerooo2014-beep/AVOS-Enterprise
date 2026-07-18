import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseProductionService } from "./enterprise-production.service";
import {
  CreateProductionJobInput,
  ExecuteProductionJobInput,
} from "./enterprise-production.types";

@Controller("avos-factory/enterprise-production")
export class EnterpriseProductionController {
  constructor(
    private readonly productionService: EnterpriseProductionService,
  ) {}

  @Get("status")
  status() {
    return this.productionService.verify();
  }

  @Get("verification")
  verification() {
    return this.productionService.verify();
  }

  @Get("metrics")
  metrics() {
    return this.productionService.getMetrics();
  }

  @Get("jobs")
  jobs() {
    return this.productionService.listJobs();
  }

  @Get("jobs/:jobId")
  job(@Param("jobId") jobId: string) {
    return this.productionService.getJob(jobId);
  }

  @Post("jobs")
  createJob(@Body() input: CreateProductionJobInput) {
    return this.productionService.createJob(input);
  }

  @Post("jobs/:jobId/execute")
  executeJob(
    @Param("jobId") jobId: string,
    @Body() input: ExecuteProductionJobInput,
  ) {
    return this.productionService.executeJob(jobId, input);
  }

  @Post("jobs/:jobId/rollback")
  rollbackJob(
    @Param("jobId") jobId: string,
    @Body("approvedBy") approvedBy: string,
  ) {
    return this.productionService.rollbackJob(jobId, approvedBy);
  }
}
