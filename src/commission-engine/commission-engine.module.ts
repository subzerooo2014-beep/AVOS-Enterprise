import { Module } from "@nestjs/common";
import { CommissionEngineController } from "./commission-engine.controller";
import { CommissionEngineService } from "./commission-engine.service";

@Module({
  controllers: [CommissionEngineController],
  providers: [CommissionEngineService],
  exports: [CommissionEngineService],
})
export class CommissionEngineModule {}
