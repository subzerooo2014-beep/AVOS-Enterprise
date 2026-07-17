import { Controller, Get, Param, Post } from "@nestjs/common";
import { KnowledgeFoundationService } from "./knowledge-foundation.service";
import { KnowledgeRegistryService } from "./knowledge-registry.service";

@Controller("avos/knowledge-fabric/kf1")
export class KnowledgeFoundationController {
  constructor(
    private readonly service: KnowledgeFoundationService,
    private readonly registry: KnowledgeRegistryService,
  ) {}

  @Post("bootstrap")
  bootstrap() {
    return this.service.bootstrap();
  }

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("assets")
  assets() {
    return this.service.listAssets();
  }

  @Get("assets/:idOrKey")
  asset(@Param("idOrKey") idOrKey: string) {
    return this.registry.resolve(idOrKey) ?? null;
  }

  @Get("verification")
  verification() {
    return this.service.verification();
  }

  @Get("smoke")
  smoke() {
    return this.service.smoke();
  }
}