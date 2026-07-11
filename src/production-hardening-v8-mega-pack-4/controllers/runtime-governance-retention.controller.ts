import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceRetentionPolicyDto,
  UpdateGovernanceRetentionPolicyStatusDto,
} from "../dto";
import {
  RuntimeGovernanceRetentionService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/retention",
)
export class RuntimeGovernanceRetentionController {
  constructor(
    private readonly retention:
      RuntimeGovernanceRetentionService,
  ) {}

  @Post("policies")
  createPolicy(
    @Body()
    dto:
      CreateGovernanceRetentionPolicyDto,
  ) {
    return this.retention.create(
      dto,
    );
  }

  @Get("policies")
  listPolicies() {
    return this.retention.list();
  }

  @Get("evaluations")
  listEvaluations() {
    return this.retention
      .listEvaluations();
  }

  @Post("policies/:id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateGovernanceRetentionPolicyStatusDto,
  ) {
    return this.retention
      .updateStatus(id, dto);
  }

  @Post("evaluate")
  evaluate(
    @Body()
    body: {
      policyId: string;
      resourceType: any;
      resourceId: string;
      resourceCreatedAt: string;
      classification: any;
    },
  ) {
    return this.retention
      .evaluate(body);
  }
}
