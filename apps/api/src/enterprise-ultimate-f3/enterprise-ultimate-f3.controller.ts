import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EnterpriseUltimateF3Service } from "./enterprise-ultimate-f3.service";
import {
  F3Advertisement,
  F3BuyerIntent,
  F3MarketSignal,
} from "./enterprise-ultimate-f3.types";

@Controller("enterprise-ultimate-f3")
export class EnterpriseUltimateF3Controller {
  constructor(private readonly service: EnterpriseUltimateF3Service) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("advertisements")
  createAdvertisement(
    @Body()
    input: Omit<
      F3Advertisement,
      | "id"
      | "status"
      | "views"
      | "favorites"
      | "messages"
      | "calls"
      | "healthScore"
      | "trustScore"
      | "salesProbability"
      | "marketRank"
      | "createdAt"
      | "updatedAt"
    >,
  ) {
    return this.service.createAdvertisement(input);
  }

  @Patch("advertisements/:id/publish")
  publishAdvertisement(@Param("id") id: string) {
    return this.service.publishAdvertisement(id);
  }

  @Post("advertisements/:id/engagement")
  recordEngagement(
    @Param("id") id: string,
    @Body()
    input: { views?: number; favorites?: number; messages?: number; calls?: number },
  ) {
    return this.service.recordEngagement(id, input);
  }

  @Patch("advertisements/:id/price")
  updatePrice(@Param("id") id: string, @Body() body: { price: number }) {
    return this.service.updatePrice(id, body.price);
  }

  @Post("market-signals")
  createMarketSignal(
    @Body() input: Omit<F3MarketSignal, "id" | "createdAt">,
  ) {
    return this.service.createMarketSignal(input);
  }

  @Post("buyer-intents")
  createBuyerIntent(
    @Body()
    input: Omit<
      F3BuyerIntent,
      "id" | "matchedAdvertisementIds" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.service.createBuyerIntent(input);
  }

  @Get("compare")
  compare(
    @Query("firstId") firstId: string,
    @Query("secondId") secondId: string,
  ) {
    return this.service.compareAdvertisements(firstId, secondId);
  }

  @Get("advertisements/:id/360")
  advertisement360(@Param("id") id: string) {
    return this.service.advertisement360(id);
  }

  @Get("command-center")
  commandCenter(@Query("tenantId") tenantId?: string) {
    return this.service.marketplaceCommandCenter(tenantId);
  }
}