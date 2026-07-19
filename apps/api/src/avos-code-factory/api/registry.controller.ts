import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
  FactoryCompilerDescriptor,
  FactoryGeneratorDescriptor,
  FactoryTemplate,
} from "../contracts/workspace.contracts";
import { FactoryCompilerRegistryService } from "../registry/compiler-registry.service";
import { FactoryGeneratorRegistryService } from "../registry/generator-registry.service";
import { FactoryRegistryBootstrapService } from "../registry/registry-bootstrap.service";
import { FactoryTemplateRegistryService } from "../registry/template-registry.service";

@Controller("avos/code-factory/registry")
export class FactoryRegistryController {
  constructor(
    private readonly bootstrap: FactoryRegistryBootstrapService,
    private readonly generators: FactoryGeneratorRegistryService,
    private readonly compilers: FactoryCompilerRegistryService,
    private readonly templates: FactoryTemplateRegistryService,
  ) {}

  @Get("summary")
  summary() {
    return this.bootstrap.summary();
  }

  @Get("generators")
  generatorList() {
    return this.generators.list();
  }

  @Post("generators")
  registerGenerator(@Body() descriptor: FactoryGeneratorDescriptor) {
    return this.generators.register(descriptor);
  }

  @Delete("generators/:id")
  unregisterGenerator(@Param("id") id: string) {
    return { removed: this.generators.unregister(id), id };
  }

  @Get("compilers")
  compilerList() {
    return this.compilers.list();
  }

  @Post("compilers")
  registerCompiler(@Body() descriptor: FactoryCompilerDescriptor) {
    return this.compilers.register(descriptor);
  }

  @Delete("compilers/:id")
  unregisterCompiler(@Param("id") id: string) {
    return { removed: this.compilers.unregister(id), id };
  }

  @Get("templates")
  templateList() {
    return this.templates.list();
  }

  @Post("templates")
  registerTemplate(@Body() template: FactoryTemplate) {
    return this.templates.register(template);
  }

  @Delete("templates/:id")
  unregisterTemplate(@Param("id") id: string) {
    return { removed: this.templates.unregister(id), id };
  }
}
