import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { CreateKnowledgeNodeInput, CreateKnowledgeRelationInput } from "./knowledge-graph.types";

@Controller("avos/knowledge-fabric/kf3")
export class KnowledgeGraphController {
  constructor(private readonly service: KnowledgeGraphService) {}

  @Post("bootstrap") bootstrap() { return this.service.bootstrap(); }
  @Post("nodes") createNode(@Body() input: CreateKnowledgeNodeInput) { return this.service.createNode(input); }
  @Post("relations") createRelation(@Body() input: CreateKnowledgeRelationInput) { return this.service.createRelation(input); }
  @Post("import-ingested") importIngested() { return this.service.importIngestedDocuments(); }
  @Get("status") status() { return this.service.status(); }
  @Get("health") health() { return this.service.health(); }
  @Get("graph") graph() { return this.service.graph(); }
  @Get("traverse/:id") traverse(@Param("id") id: string, @Query("depth") depth?: string) {
    return this.service.traverse(id, depth ? Number(depth) : 2);
  }
  @Get("verification") verification() { return this.service.verification(); }
  @Get("smoke") smoke() { return this.service.smoke(); }
}