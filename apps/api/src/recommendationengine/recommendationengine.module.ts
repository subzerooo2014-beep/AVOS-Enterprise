import { Module } from "@nestjs/common";
import { RecommendationengineController } from "./recommendationengine.controller";
import { RecommendationengineService } from "./recommendationengine.service";

@Module({
  controllers:[RecommendationengineController],
  providers:[RecommendationengineService],
})
export class RecommendationengineModule{}
