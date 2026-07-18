import { Module } from "@nestjs/common";
import { ArchitectureRegistryService } from "./architecture-registry.service";
import { FactoryArchitectureEngineController } from "./factory-architecture-engine.controller";
import { FactoryArchitectureEngineService } from "./factory-architecture-engine.service";

@Module({
  controllers: [FactoryArchitectureEngineController],
  providers: [
    ArchitectureRegistryService,
    FactoryArchitectureEngineService
  ],
  exports: [
    ArchitectureRegistryService,
    FactoryArchitectureEngineService
  ]
})
export class AvosFactoryMegaPack3Module {}
