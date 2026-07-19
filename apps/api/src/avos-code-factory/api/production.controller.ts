import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BuildPackageDto } from "../dto/build-package.dto";
import { GenerateCapabilityDto } from "../dto/generate-capability.dto";
import { MaterializePackageDto } from "../dto/materialize-package.dto";
import { FactoryBuildEngineService } from "../production/build-engine.service";
import { FactoryCapabilityGeneratorService } from "../production/capability-generator.service";
import { FactoryMaterializerService } from "../production/materializer.service";

@Controller("avos/code-factory/production")
export class FactoryProductionController {
  constructor(
    private readonly materializer: FactoryMaterializerService,
    private readonly buildEngine: FactoryBuildEngineService,
    private readonly capabilityGenerator: FactoryCapabilityGeneratorService,
  ) {}

  @Get("status")
  status() {
    return {
      build: this.buildEngine.status(),
      materializations: this.materializer.list().length,
      generatedAt: new Date().toISOString(),
    };
  }

  @Get("materializations")
  materializations() {
    return this.materializer.list();
  }

  @Get("materializations/:id")
  materialization(@Param("id") id: string) {
    return this.materializer.get(id);
  }

  @Post("materialize")
  materialize(@Body() dto: MaterializePackageDto) {
    return this.materializer.materialize(
      dto.packageId,
      dto.targetDirectory,
      dto.overwrite ?? false,
    );
  }

  @Get("builds")
  builds() {
    return this.buildEngine.list();
  }

  @Get("builds/:id")
  build(@Param("id") id: string) {
    return this.buildEngine.get(id);
  }

  @Post("build")
  buildPackage(@Body() dto: BuildPackageDto) {
    return this.buildEngine.build(dto);
  }

  @Post("capabilities/generate")
  generateCapability(@Body() dto: GenerateCapabilityDto) {
    return this.capabilityGenerator.generate(dto);
  }
}
