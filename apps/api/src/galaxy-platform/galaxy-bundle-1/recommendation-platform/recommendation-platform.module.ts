import { Module } from "@nestjs/common";
import { RecommendationPlatformController } from "./recommendation-platform.controller";
import { RecommendationPlatformService } from "./recommendation-platform.service";

@Module({
  controllers: [RecommendationPlatformController],
  providers: [RecommendationPlatformService],
  exports: [RecommendationPlatformService],
})
export class RecommendationPlatformModule {}