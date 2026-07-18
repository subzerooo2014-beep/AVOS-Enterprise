import { Injectable, OnModuleInit } from "@nestjs/common";
import { GeneratorPluginRegistryService } from "./generator-plugin-registry.service";
import { AvosFoundationGeneratorPlugin } from "./avos-foundation-generator.plugin";

@Injectable()
export class GeneratorPluginBootstrapService implements OnModuleInit {
  constructor(
    private readonly registry: GeneratorPluginRegistryService,
    private readonly foundationPlugin: AvosFoundationGeneratorPlugin
  ) {}

  async onModuleInit(): Promise<void> {
    await this.foundationPlugin.initialize();
    this.registry.register(this.foundationPlugin);
  }
}
