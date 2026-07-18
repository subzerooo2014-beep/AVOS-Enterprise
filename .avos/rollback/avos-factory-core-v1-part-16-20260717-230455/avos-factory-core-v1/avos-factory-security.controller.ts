import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactorySecurityPolicyRegistryService
} from "./avos-factory-security-policy-registry.service";
import {
  AvosFactoryPolicyEvaluationService
} from "./avos-factory-policy-evaluation.service";
import {
  AvosFactorySecurityAssessmentService
} from "./avos-factory-security-assessment.service";
import {
  AvosFactoryPolicyExceptionService
} from "./avos-factory-policy-exception.service";
import {
  AvosFactorySecuritySmokeService
} from "./avos-factory-security-smoke.service";

@Controller("avos/factory/v1/security")
export class AvosFactorySecurityController {
  constructor(
    private readonly policies: AvosFactorySecurityPolicyRegistryService,
    private readonly evaluation: AvosFactoryPolicyEvaluationService,
    private readonly assessment: AvosFactorySecurityAssessmentService,
    private readonly exceptions: AvosFactoryPolicyExceptionService,
    private readonly smoke: AvosFactorySecuritySmokeService
  ) {}

  @Get("policies")
  policyList() {
    return { items: this.policies.list() };
  }

  @Post("policies")
  registerPolicy(
    @Body()
    input: Parameters<AvosFactorySecurityPolicyRegistryService["register"]>[0]
  ) {
    return this.policies.register(input);
  }

  @Post("evaluate")
  evaluate(
    @Body()
    input: Parameters<AvosFactoryPolicyEvaluationService["evaluate"]>[0]
  ) {
    return this.evaluation.evaluate(input);
  }

  @Get("decisions")
  decisionList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.evaluation.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("assessments/run")
  runAssessment(
    @Body()
    input: Parameters<AvosFactorySecurityAssessmentService["assess"]>[0]
  ) {
    return this.assessment.assess(input);
  }

  @Get("assessments")
  assessmentList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.assessment.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("exceptions")
  requestException(
    @Body()
    input: Parameters<AvosFactoryPolicyExceptionService["request"]>[0]
  ) {
    return this.exceptions.request(input);
  }

  @Post("exceptions/:id/decide")
  decideException(
    @Param("id") id: string,
    @Body()
    body: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
      decision: "approved" | "rejected";
    }
  ) {
    return this.exceptions.decide({
      exceptionId: id,
      ...body
    });
  }

  @Get("exceptions")
  exceptionList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.exceptions.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
