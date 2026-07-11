import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateApprovalMatrixRuleDto,
} from "../dto";
import {
  RuntimeGovernanceApprovalMatrixService,
  RuntimeGovernanceRequestService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/approval-matrix",
)
export class RuntimeGovernanceApprovalMatrixController {
  constructor(
    private readonly matrix:
      RuntimeGovernanceApprovalMatrixService,
    private readonly requests:
      RuntimeGovernanceRequestService,
  ) {}

  @Post("rules")
  createRule(
    @Body()
    dto:
      CreateApprovalMatrixRuleDto,
  ) {
    return this.matrix
      .createRule(dto);
  }

  @Get("rules")
  listRules() {
    return this.matrix
      .listRules();
  }

  @Get("rules/:id")
  getRule(
    @Param("id")
    id: string,
  ) {
    return this.matrix
      .getRule(id);
  }

  @Post("requests/:requestId/evaluate")
  evaluate(
    @Param("requestId")
    requestId: string,
  ) {
    const request =
      this.requests.get(
        requestId,
      );

    return this.matrix
      .evaluate(request);
  }
}
