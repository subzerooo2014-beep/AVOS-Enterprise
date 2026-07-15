import { Module } from "@nestjs/common";
import { ContinuousEvolutionSovereigntyController } from "./continuous-evolution-sovereignty.controller";
import { ContinuousEvolutionSovereigntyService } from "./continuous-evolution-sovereignty.service";

@Module({
  controllers:[ContinuousEvolutionSovereigntyController],
  providers:[ContinuousEvolutionSovereigntyService],
  exports:[ContinuousEvolutionSovereigntyService]
})
export class ContinuousEvolutionSovereigntyModule {}