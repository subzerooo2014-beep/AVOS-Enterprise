import { Body, Controller, Get, Post } from "@nestjs/common";
import { MarketplaceAiService } from "./marketplace-ai.service";
import {
  RecommendationRequest,
  SearchItem,
  SearchRequest,
} from "./marketplace-ai.types";

@Controller("marketplace-ai")
export class MarketplaceAiController {
  constructor(private readonly marketplaceAi: MarketplaceAiService) {}

  @Post("items")
  upsertItem(@Body() item: SearchItem) {
    return this.marketplaceAi.upsertItem(item);
  }

  @Post("search")
  search(@Body() request: SearchRequest) {
    return this.marketplaceAi.search(request);
  }

  @Post("recommendations")
  recommend(@Body() request: RecommendationRequest) {
    return this.marketplaceAi.recommend(request);
  }

  @Get("dashboard")
  dashboard() {
    return this.marketplaceAi.dashboard();
  }
}