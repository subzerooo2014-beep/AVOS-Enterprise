import { Module } from "@nestjs/common";
import { GeneratorPluginController } from "./generator-plugin.controller";
import { GeneratorPluginRegistryService } from "./generator-plugin-registry.service";
import { GeneratorPluginBootstrapService } from "./generator-plugin-bootstrap.service";
import { AvosFoundationGeneratorPlugin } from "./avos-foundation-generator.plugin";

@Module({
  controllers: [
    GeneratorPluginController
  ],
  providers: [
    GeneratorPluginRegistryService,
    AvosFoundationGeneratorPlugin,
    GeneratorPluginBootstrapService
  ],
  exports: [
    GeneratorPluginRegistryService,
    AvosFoundationGeneratorPlugin
  ]
})
export class AvosFactoryMegaPack8Module {}
