import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { CreateSloDto } from "./dto/create-slo.dto";
import { CreateTrafficPolicyDto } from "./dto/create-traffic-policy.dto";
import { ExecuteProtectionDto } from "./dto/execute-protection.dto";
import { GenerateCapacityForecastDto } from "./dto/generate-capacity-forecast.dto";
import { RecordMetricSampleDto } from "./dto/record-metric-sample.dto";
import { ProductionHardeningV7MegaPack12Service } from "./production-hardening-v7-mega-pack-12.service";

@Controller("production-hardening-v7-mega-pack-12")
export class ProductionHardeningV7MegaPack12Controller {
  constructor(
    private readonly service: ProductionHardeningV7MegaPack12Service,
  ) {}

  @Get("status")
  status() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.service.getSnapshot(),
    };
  }

  @Get("verify")
  verify() {
    return this.service.runVerification();
  }

  @Get("evidence/verify")
  verifyEvidence() {
    return {
      success: true,
      ...this.service.verifyEvidenceChain(),
    };
  }

  @Get("evidence")
  evidence() {
    return {
      success: true,
      entries: this.service.listEvidenceEntries(),
    };
  }

  @Get("events")
  events() {
    return {
      success: true,
      events: this.service.listPlatformEvents(),
    };
  }

  @Post("slos")
  createSlo(@Body() dto: CreateSloDto) {
    return {
      success: true,
      slo: this.service.createSlo(dto, "api"),
    };
  }

  @Get("slos")
  listSlos() {
    return {
      success: true,
      slos: this.service.listSlos(),
    };
  }

  @Get("slos/:sloId")
  getSlo(@Param("sloId") sloId: string) {
    return {
      success: true,
      slo: this.service.getSlo(sloId),
    };
  }

  @Post("slos/:sloId/activate")
  activateSlo(@Param("sloId") sloId: string) {
    return {
      success: true,
      slo: this.service.activateSlo(
        sloId,
        "api",
      ),
    };
  }

  @Post("metric-samples")
  recordMetricSample(
    @Body() dto: RecordMetricSampleDto,
  ) {
    return {
      success: true,
      sample: this.service.recordMetricSample(
        dto,
        "api",
      ),
    };
  }

  @Get("metric-samples")
  listMetricSamples(@Query("sloId") sloId?: string) {
    return {
      success: true,
      samples:
        this.service.listMetricSamples(sloId),
    };
  }

  @Post("slos/:sloId/evaluate")
  evaluateSlo(@Param("sloId") sloId: string) {
    return {
      success: true,
      evaluation: this.service.evaluateSlo(
        sloId,
        undefined,
        "api",
      ),
    };
  }

  @Get("slo-evaluations")
  listEvaluations(@Query("sloId") sloId?: string) {
    return {
      success: true,
      evaluations:
        this.service.listEvaluations(sloId),
    };
  }

  @Post("slos/:sloId/error-budget")
  calculateErrorBudget(
    @Param("sloId") sloId: string,
  ) {
    return {
      success: true,
      errorBudget:
        this.service.calculateErrorBudget(
          sloId,
          "api",
        ),
    };
  }

  @Get("error-budgets")
  listErrorBudgets() {
    return {
      success: true,
      errorBudgets:
        this.service.listErrorBudgets(),
    };
  }

  @Post("capacity-forecasts")
  generateCapacityForecast(
    @Body() dto: GenerateCapacityForecastDto,
  ) {
    return {
      success: true,
      forecast:
        this.service.generateCapacityForecast(
          dto,
          "api",
        ),
    };
  }

  @Get("capacity-forecasts")
  listCapacityForecasts() {
    return {
      success: true,
      forecasts:
        this.service.listCapacityForecasts(),
    };
  }

  @Post("traffic-policies")
  createTrafficPolicy(
    @Body() dto: CreateTrafficPolicyDto,
  ) {
    return {
      success: true,
      policy: this.service.createTrafficPolicy(
        dto,
        "api",
      ),
    };
  }

  @Get("traffic-policies")
  listTrafficPolicies() {
    return {
      success: true,
      policies:
        this.service.listTrafficPolicies(),
    };
  }

  @Post("traffic-policies/:policyId/activate")
  activateTrafficPolicy(
    @Param("policyId") policyId: string,
  ) {
    return {
      success: true,
      policy:
        this.service.activateTrafficPolicy(
          policyId,
          "api",
        ),
    };
  }

  @Post("traffic-policies/:policyId/execute")
  executeProtection(
    @Param("policyId") policyId: string,
    @Body() dto: ExecuteProtectionDto,
  ) {
    return {
      success: true,
      execution:
        this.service.executeProtection(
          policyId,
          dto,
          "api",
        ),
    };
  }

  @Get("protection-executions")
  listProtectionExecutions() {
    return {
      success: true,
      executions:
        this.service.listProtectionExecutions(),
    };
  }

  @Get("reliability-decisions")
  listReliabilityDecisions() {
    return {
      success: true,
      decisions:
        this.service.listReliabilityDecisions(),
    };
  }
}
