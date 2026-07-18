import { Module } from "@nestjs/common";
import { FactoryGenerationEngineController } from "./factory-generation-engine.controller";
import { FactoryGenerationEngineService } from "./factory-generation-engine.service";

@Module({
  controllers:[FactoryGenerationEngineController],
  providers:[FactoryGenerationEngineService],
  exports:[FactoryGenerationEngineService]
})
export class AvosFactoryMegaPack5Module {}
