import { Body, Controller, Get, Post } from "@nestjs/common";
import { NestJsModuleBlueprint } from "./nestjs-generator.contracts";
import { NestJsGeneratorService } from "./nestjs-generator.service";

@Controller("avos/factory/generators/nestjs")
export class NestJsGeneratorController {
  constructor(private readonly generator: NestJsGeneratorService) {}

  @Get("status")
  getStatus() {
    return this.generator.getStatus();
  }

  @Post("generate")
  generate(@Body() blueprint: NestJsModuleBlueprint) {
    return this.generator.generate(blueprint);
  }

  @Post("smoke")
  smoke() {
    return this.generator.runSmoke();
  }
}
