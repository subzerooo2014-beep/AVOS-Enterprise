import { Module } from "@nestjs/common";
import { TrustEngineController } from "./trust-engine.controller";
import { TrustEngineService } from "./trust-engine.service";

@Module({
  controllers: [TrustEngineController],
  providers: [TrustEngineService],
  exports: [TrustEngineService],
})
export class TrustEngineModule {}
