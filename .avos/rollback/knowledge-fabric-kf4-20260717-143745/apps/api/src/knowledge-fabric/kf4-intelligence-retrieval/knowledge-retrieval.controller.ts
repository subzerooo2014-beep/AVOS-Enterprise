import { Body, Controller, Get, Post } from "@nestjs/common";
import { KnowledgeRetrievalService } from "./knowledge-retrieval.service";
import { KnowledgeContextInput, KnowledgeSearchInput } from "./knowledge-retrieval.types";

@Controller("avos/knowledge-fabric/kf4")
export class KnowledgeRetrievalController {
  constructor(private readonly service: KnowledgeRetrievalService) {}

  @Post("bootstrap") bootstrap() { return this.service.bootstrap(); }
  @Post("refresh-index") refreshIndex() { return this.service.refreshIndex(); }
  @Post("search") search(@Body() input: KnowledgeSearchInput) { return this.service.search(input); }
  @Post("retrieve") retrieve(@Body() input: KnowledgeContextInput) { return this.service.retrieve(input); }
  @Get("status") status() { return this.service.status(); }
  @Get("health") health() { return this.service.health(); }
  @Get("verification") verification() { return this.service.verification(); }
  @Get("smoke") smoke() { return this.service.smoke(); }
}