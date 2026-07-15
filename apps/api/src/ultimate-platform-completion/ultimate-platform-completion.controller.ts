import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { UltimatePlatformCompletionService } from "./ultimate-platform-completion.service";
import {
  UltimatePlatformCapability,
  UltimatePortfolioItem,
  UltimateScenario,
  UltimateScorecard,
} from "./ultimate-platform-completion.types";

@Controller("ultimate-platform-completion")
export class UltimatePlatformCompletionController {
  constructor(
    private readonly platform: UltimatePlatformCompletionService,
  ) {}

  @Get()
  framework() {
    return this.platform.framework();
  }

  @Post(":capability/portfolio")
  createPortfolioItem(
    @Param("capability") capability: UltimatePlatformCapability,
    @Body()
    input: Omit<
      UltimatePortfolioItem,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.platform.createPortfolioItem(capability, input);
  }

  @Get("portfolio")
  listPortfolio(
    @Query("capability") capability?: UltimatePlatformCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.platform.listPortfolio(capability, tenantId);
  }

  @Patch("portfolio/:id/activate")
  activatePortfolioItem(@Param("id") id: string) {
    return this.platform.activatePortfolioItem(id);
  }

  @Post("portfolio/:id/scenarios")
  createScenario(
    @Param("id") id: string,
    @Body()
    input: Omit<UltimateScenario, "id" | "portfolioItemId" | "createdAt">,
  ) {
    return this.platform.createScenario(id, input);
  }

  @Post("portfolio/:id/scorecards")
  recordScorecard(
    @Param("id") id: string,
    @Body()
    input: Omit<
      UltimateScorecard,
      "id" | "portfolioItemId" | "status" | "recordedAt"
    >,
  ) {
    return this.platform.recordScorecard(id, input);
  }

  @Post("portfolio/:id/complete")
  completePortfolioItem(@Param("id") id: string) {
    return this.platform.completePortfolioItem(id);
  }

  @Get("command-center")
  commandCenter() {
    return this.platform.commandCenter();
  }
}