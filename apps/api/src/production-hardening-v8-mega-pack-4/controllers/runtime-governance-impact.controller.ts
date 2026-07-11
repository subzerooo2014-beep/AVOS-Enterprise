import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  AnalyzeGovernanceImpactDto,
} from "../dto";
import {
  RuntimeGovernanceImpactService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/impact-analysis",
)
export class RuntimeGovernanceImpactController {
  constructor(
    private readonly impact:
      RuntimeGovernanceImpactService,
  ) {}

  @Post("requests/:requestId")
  analyze(
    @Param("requestId")
    requestId: string,
    @Body()
    dto:
      AnalyzeGovernanceImpactDto,
  ) {
    return this.impact
      .analyze(requestId, dto);
  }

  @Get()
  list() {
    return this.impact.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.impact.get(id);
  }
}
