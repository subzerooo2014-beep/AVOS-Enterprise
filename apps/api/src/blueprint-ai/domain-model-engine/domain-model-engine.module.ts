import { Module } from "@nestjs/common";
import { DomainModelEngineService } from "./domain-model-engine.service";
import { DomainModelEngineController } from "./domain-model-engine.controller";

@Module({
  providers:[DomainModelEngineService],
  controllers:[DomainModelEngineController],
  exports:[DomainModelEngineService]
})
export class DomainModelEngineModule {}
