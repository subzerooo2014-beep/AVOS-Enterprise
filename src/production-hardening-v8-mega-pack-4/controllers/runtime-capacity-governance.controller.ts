import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateCapacityPolicyDto,
  EvaluateCapacityPolicyDto,
} from "../dto";
import {
  RuntimeCapacityGovernanceService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/capacity",
)
export class RuntimeCapacityGovernanceController {
  constructor(
    private readonly capacity:
      RuntimeCapacityGovernanceService,
  ) {}

  @Post("policies")
  createPolicy(
    @Body()
    dto: CreateCapacityPolicyDto,
  ) {
    return this.capacity.create(dto);
  }

  @Post("policies/:id/evaluate")
  evaluate(
    @Param("id")
    id: string,
    @Body()
    dto: EvaluateCapacityPolicyDto,
  ) {
    return this.capacity.evaluate(
      id,
      dto,
    );
  }

  @Get("policies")
  listPolicies() {
    return this.capacity
      .listPolicies();
  }

  @Get("evaluations")
  listEvaluations() {
    return this.capacity
      .listEvaluations();
  }

  @Get("policies/:id")
  getPolicy(
    @Param("id")
    id: string,
  ) {
    return this.capacity.get(id);
  }
}
