import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { EvaluateRuntimeRiskDto } from "../dto";
import { RuntimeRiskEvaluationService } from "../services/runtime-risk-evaluation.service";

@Controller("production-hardening-v8-mega-pack-3/risk")
export class RuntimeRiskEvaluationController {
  constructor(
    private readonly risk: RuntimeRiskEvaluationService,
  ) {}

  @Post("evaluate")
  evaluate(@Body() dto: EvaluateRuntimeRiskDto) {
    return this.risk.evaluate(dto);
  }

  @Get("evaluations")
  list() {
    return this.risk.list();
  }

  @Get("evaluations/:id")
  get(@Param("id") id: string) {
    return this.risk.get(id);
  }
}
