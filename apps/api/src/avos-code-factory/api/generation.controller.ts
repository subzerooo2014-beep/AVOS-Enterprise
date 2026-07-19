import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GenerateProjectDto } from "../dto/generate-project.dto";
import { FactoryGenerationEngineService } from "../generation/generation-engine.service";
import { FactoryGenerationJobService } from "../generation/generation-job.service";
import { FactoryGenerationPackageService } from "../generation/package.service";

@Controller("avos/code-factory/generation")
export class FactoryGenerationController {
  constructor(
    private readonly engine: FactoryGenerationEngineService,
    private readonly jobs: FactoryGenerationJobService,
    private readonly packages: FactoryGenerationPackageService,
  ) {}

  @Get("status")
  status() {
    return this.engine.status();
  }

  @Get("jobs")
  jobList() {
    return this.jobs.list();
  }

  @Get("jobs/:id")
  job(@Param("id") id: string) {
    return this.jobs.get(id);
  }

  @Get("packages")
  packageList() {
    return this.packages.list();
  }

  @Get("packages/:id")
  generationPackage(@Param("id") id: string) {
    return this.packages.get(id);
  }

  @Post("generate")
  generate(@Body() dto: GenerateProjectDto) {
    return this.engine.generate(dto);
  }
}
