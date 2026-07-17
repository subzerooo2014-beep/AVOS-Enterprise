import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { KnowledgeFoundationService } from "./knowledge-foundation.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { KnowledgeRegistryService } from "./knowledge-registry.service";
import {
  CreateKnowledgeRelationInput,
  RegisterKnowledgeInput,
  UpdateKnowledgeInput,
} from "./knowledge.types";

@Controller("knowledge-fabric")
export class KnowledgeFabricController {
  constructor(
    private readonly foundation: KnowledgeFoundationService,
    private readonly registry: KnowledgeRegistryService,
    private readonly graph: KnowledgeGraphService,
  ) {}

  @Get("status")
  status() {
    return this.foundation.status();
  }

  @Get("health")
  health() {
    return this.foundation.health();
  }

  @Get("knowledge")
  list() {
    return {
      success: true,
      items: this.registry.list(),
      snapshot: this.registry.snapshot(),
    };
  }

  @Get("knowledge/:id")
  getById(@Param("id") id: string) {
    return {
      success: true,
      item: this.registry.getById(id) ?? null,
    };
  }

  @Post("knowledge")
  register(@Body() input: RegisterKnowledgeInput) {
    return {
      success: true,
      item: this.registry.register(input),
    };
  }

  @Patch("knowledge/:id")
  update(
    @Param("id") id: string,
    @Body() input: UpdateKnowledgeInput,
  ) {
    return {
      success: true,
      item: this.registry.update(id, input),
    };
  }

  @Post("knowledge/:id/activate")
  activate(@Param("id") id: string) {
    return {
      success: true,
      item: this.registry.activate(id),
    };
  }

  @Post("knowledge/:id/deprecate")
  deprecate(@Param("id") id: string) {
    return {
      success: true,
      item: this.registry.deprecate(id),
    };
  }

  @Post("knowledge/:id/archive")
  archive(@Param("id") id: string) {
    return {
      success: true,
      item: this.registry.archive(id),
    };
  }

  @Post("relations")
  connect(@Body() input: CreateKnowledgeRelationInput) {
    return {
      success: true,
      item: this.graph.connect(input),
    };
  }

  @Get("knowledge/:id/dependencies")
  dependencies(@Param("id") id: string) {
    return {
      success: true,
      items: this.graph.dependenciesOf(id),
    };
  }

  @Get("knowledge/:id/dependents")
  dependents(@Param("id") id: string) {
    return {
      success: true,
      items: this.graph.dependentsOf(id),
    };
  }
}