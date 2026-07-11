import { Module } from "@nestjs/common";
import { FraudEngineController } from "./fraud-engine.controller";
import { FraudEngineService } from "./fraud-engine.service";

@Module({
  controllers: [FraudEngineController],
  providers: [FraudEngineService],
  exports: [FraudEngineService],
})
export class FraudEngineModule {}
