import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";
import {
  AvosFactoryValidationRuleRegistryService
} from "./avos-factory-validation-rule-registry.service";
import {
  AvosFactoryValidationEngineService
} from "./avos-factory-validation-engine.service";
import {
  AvosFactoryQualityGateService
} from "./avos-factory-quality-gate.service";
import {
  AvosFactoryDefectRegistryService
} from "./avos-factory-defect-registry.service";
import {
  AvosFactoryComplianceReportingService
} from "./avos-factory-compliance-reporting.service";
import {
  AvosFactoryValidationSmokeService
} from "./avos-factory-validation-smoke.service";

@Controller("avos/factory/v1/validation")
export class AvosFactoryValidationController {
  constructor(
    private readonly rules: AvosFactoryValidationRuleRegistryService,
    private readonly validation: AvosFactoryValidationEngineService,
    private readonly gates: AvosFactoryQualityGateService,
    private readonly defects: AvosFactoryDefectRegistryService,
    private readonly compliance: AvosFactoryComplianceReportingService,
    private readonly smoke: AvosFactoryValidationSmokeService
  ) {}

  @Get("rules")
  ruleList() {
    return { items: this.rules.list() };
  }

  @Post("rules")
  registerRule(
    @Body()
    input: Parameters<AvosFactoryValidationRuleRegistryService["register"]>[0]
  ) {
    return this.rules.register(input);
  }

  @Post("reports/run")
  runValidation(
    @Body()
    input: Parameters<AvosFactoryValidationEngineService["validate"]>[0]
  ) {
    return this.validation.validate(input);
  }

  @Get("reports")
  reportList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.validation.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("gates")
  createGate(
    @Body()
    input: Parameters<AvosFactoryQualityGateService["create"]>[0]
  ) {
    return this.gates.create(input);
  }

  @Post("gates/:id/decide")
  decideGate(
    @Param("id") id: string,
    @Body()
    body: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
      decision: "approved" | "rejected";
      reason: string;
    }
  ) {
    return this.gates.decide({
      gateId: id,
      ...body
    });
  }

  @Get("gates")
  gateList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.gates.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("defects/from-report/:reportId")
  createDefects(@Param("reportId") reportId: string) {
    return {
      items: this.defects.createFromReport(reportId)
    };
  }

  @Put("defects/:id")
  updateDefect(
    @Param("id") id: string,
    @Body()
    body: {
      status: "open" | "in-progress" | "resolved" | "accepted-risk";
      owner?: string;
      resolution?: string;
    }
  ) {
    return this.defects.update({
      defectId: id,
      ...body
    });
  }

  @Get("defects")
  defectList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.defects.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("compliance/:subjectId")
  complianceSummary(@Param("subjectId") subjectId: string) {
    return this.compliance.summarize(subjectId);
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
