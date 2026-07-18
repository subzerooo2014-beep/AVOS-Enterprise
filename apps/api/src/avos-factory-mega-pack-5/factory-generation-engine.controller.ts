import { Controller, Get } from "@nestjs/common";
import { FactoryGenerationEngineService } from "./factory-generation-engine.service";

@Controller("avos/factory/generation")
export class FactoryGenerationEngineController {
  constructor(private readonly engine: FactoryGenerationEngineService){}

  @Get("status")
  status() {
    return this.engine.status();
  }
}
