import {
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import {
  EvaluateGovernanceRequestDto,
} from "../dto";
import {
  RuntimeGovernanceEvaluationService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/evaluations",
)
export class RuntimeGovernanceEvaluationController {
  constructor(
    private readonly evaluations:
      RuntimeGovernanceEvaluationService,
  ) {}

  @Post("requests/:id")
  evaluate(
    @Param("id")
    id: string,
    @Body()
    dto:
      EvaluateGovernanceRequestDto,
  ) {
    return this.evaluations
      .evaluate(id, dto);
  }
}
