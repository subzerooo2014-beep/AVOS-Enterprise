import { Module } from "@nestjs/common";
import { GeneratorArtifactStoreService } from "./generator-artifact-store.service";
import { GeneratorExecutionStoreService } from "./generator-execution-store.service";
import { GeneratorRegistryService } from "./generator-registry.service";
import { GeneratorRuntimeController } from "./generator-runtime.controller";
import { GeneratorRuntimeService } from "./generator-runtime.service";

@Module({
  controllers: [GeneratorRuntimeController],
  providers: [
    GeneratorRegistryService,
    GeneratorArtifactStoreService,
    GeneratorExecutionStoreService,
    GeneratorRuntimeService
  ],
  exports: [
    GeneratorRegistryService,
    GeneratorArtifactStoreService,
    GeneratorExecutionStoreService,
    GeneratorRuntimeService
  ]
})
export class AvosFactoryMegaPack6Module {}
