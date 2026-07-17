import { Module } from "@nestjs/common";
import { ArchitectureRecommendationController } from "./recommendation.controller";
import { ArchitectureRecommendationService } from "./recommendation.service";

@Module({
  controllers: [ArchitectureRecommendationController],
  providers: [ArchitectureRecommendationService],
  exports: [ArchitectureRecommendationService],
})
export class ArchitectureRecommendationModule {}