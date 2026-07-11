import { Module } from "@nestjs/common";
import { DistributionEngineController } from "./distribution-engine.controller";
import { DistributionEngineService } from "./distribution-engine.service";

@Module({
  controllers: [DistributionEngineController],
  providers: [DistributionEngineService],
  exports: [DistributionEngineService],
})
export class DistributionEngineModule {}
