import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { KnowledgeIngestionService } from "./knowledge-ingestion.service";
import { IngestKnowledgeInput } from "./knowledge-ingestion.types";

@Controller("avos/knowledge-fabric/kf2")
export class KnowledgeIngestionController {
  constructor(private readonly service: KnowledgeIngestionService) {}

  @Post("bootstrap")
  bootstrap() {
    return this.service.bootstrap();
  }

  @Post("ingest")
  ingest(@Body() input: IngestKnowledgeInput) {
    return this.service.ingest(input);
  }

  @Post("ingest/batch")
  ingestBatch(@Body() inputs: IngestKnowledgeInput[]) {
    return this.service.ingestBatch(inputs);
  }

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("documents")
  documents() {
    return this.service.listDocuments();
  }

  @Get("documents/:id")
  document(@Param("id") id: string) {
    return this.service.findDocument(id) ?? null;
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