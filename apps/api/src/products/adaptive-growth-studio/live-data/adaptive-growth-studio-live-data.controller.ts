import {
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { AdaptiveGrowthStudioLiveDataService } from "./adaptive-growth-studio-live-data.service";

@Controller(
  "avos/products/adaptive-growth-studio/live",
)
export class AdaptiveGrowthStudioLiveDataController {
  constructor(
    private readonly liveData:
      AdaptiveGrowthStudioLiveDataService,
  ) {}

  @Get("snapshot")
  snapshot() {
    return this.liveData.snapshot();
  }

  @Post("refresh")
  refresh() {
    return this.liveData.snapshot({
      force: true,
    });
  }

  @Get("health")
  health() {
    return this.liveData.health();
  }
}