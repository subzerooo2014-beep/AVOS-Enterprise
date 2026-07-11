import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  ReviewRuntimeDecisionDto,
} from "../dto";
import {
  RuntimeDecisionCenterService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/decision-center",
)
export class RuntimeDecisionCenterController {
  constructor(
    private readonly decisions:
      RuntimeDecisionCenterService,
  ) {}

  @Post("requests/:requestId/generate")
  generate(
    @Param("requestId")
    requestId: string,
    @Body()
    runtimeContext:
      Record<string, unknown>,
  ) {
    return this.decisions.generate(
      requestId,
      runtimeContext ?? {},
    );
  }

  @Get("decisions")
  list() {
    return this.decisions.list();
  }

  @Get("decisions/:id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.decisions.get(id);
  }

  @Post("decisions/:id/review")
  review(
    @Param("id")
    id: string,
    @Body()
    dto:
      ReviewRuntimeDecisionDto,
  ) {
    return this.decisions.review(
      id,
      dto,
    );
  }

  @Post("decisions/:id/execute")
  execute(
    @Param("id")
    id: string,
  ) {
    return this.decisions
      .markExecuted(id);
  }

  @Get("snapshot")
  snapshot() {
    return this.decisions
      .snapshot();
  }
}
