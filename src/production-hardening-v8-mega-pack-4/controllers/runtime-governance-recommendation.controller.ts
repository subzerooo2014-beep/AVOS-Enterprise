import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  RuntimeGovernanceRecommendationService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/recommendations",
)
export class RuntimeGovernanceRecommendationController {
  constructor(
    private readonly recommendations:
      RuntimeGovernanceRecommendationService,
  ) {}

  @Get()
  list() {
    return this.recommendations
      .list();
  }
}
