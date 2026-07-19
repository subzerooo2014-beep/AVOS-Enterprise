import { Module } from "@nestjs/common";
import { FactoryCompilerRegistryService } from "./compiler-registry.service";
import { FactoryGeneratorRegistryService } from "./generator-registry.service";
import { FactoryRegistryBootstrapService } from "./registry-bootstrap.service";
import { FactoryTemplateRegistryService } from "./template-registry.service";

@Module({
  providers: [
    FactoryCompilerRegistryService,
    FactoryGeneratorRegistryService,
    FactoryRegistryBootstrapService,
    FactoryTemplateRegistryService,
  ],
  exports: [
    FactoryCompilerRegistryService,
    FactoryGeneratorRegistryService,
    FactoryRegistryBootstrapService,
    FactoryTemplateRegistryService,
  ],
})
export class FactoryRegistryModule {}
