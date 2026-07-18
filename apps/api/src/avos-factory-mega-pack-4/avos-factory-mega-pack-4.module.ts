import { Module } from "@nestjs/common";
import { FactoryPlanningEngineController } from "./factory-planning-engine.controller";
import { FactoryPlanningEngineService } from "./factory-planning-engine.service";
import { FactoryPlanningRegistryService } from "./factory-planning-registry.service";

@Module({
  controllers: [FactoryPlanningEngineController],
  providers: [
    FactoryPlanningRegistryService,
    FactoryPlanningEngineService
  ],
  exports: [
    FactoryPlanningRegistryService,
    FactoryPlanningEngineService
  ]
})
export class AvosFactoryMegaPack4Module {}
