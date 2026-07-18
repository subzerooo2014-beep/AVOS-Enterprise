import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { GeneratorPluginRegistryService } from "./generator-plugin-registry.service";

@Controller("avos/factory/plugins")
export class GeneratorPluginController {
  constructor(
    private readonly registry: GeneratorPluginRegistryService
  ) {}

  @Get("status")
  status() {
    return {
      healthy: true,
      component: "Generator SDK & Plugin System",
      plugins: this.registry.count()
    };
  }

  @Get()
  list() {
    return this.registry.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    const plugin = this.registry.get(id);

    if (!plugin) {
      throw new NotFoundException(
        `Generator plugin "${id}" was not found.`
      );
    }

    return plugin;
  }
}
