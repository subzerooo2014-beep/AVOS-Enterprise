import { Module } from "@nestjs/common";
import { QualityEngineService } from "./quality-engine.service";
import { QualityEngineController } from "./quality-engine.controller";

@Module({
  providers:[QualityEngineService],
  controllers:[QualityEngineController],
  exports:[QualityEngineService]
})
export class QualityEngineModule {}
