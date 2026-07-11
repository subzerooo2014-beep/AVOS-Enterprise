import { Module } from "@nestjs/common";
import { NegotiationEngineController } from "./negotiation-engine.controller";
import { NegotiationEngineService } from "./negotiation-engine.service";

@Module({
  controllers: [NegotiationEngineController],
  providers: [NegotiationEngineService],
  exports: [NegotiationEngineService],
})
export class NegotiationEngineModule {}
