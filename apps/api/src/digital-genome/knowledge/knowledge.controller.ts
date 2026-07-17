import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DigitalGenomeKnowledgeService } from "./knowledge.service";
import { DigitalGenomeKnowledgeRecord } from "./knowledge.types";

@Controller("digital-genome/knowledge")
export class DigitalGenomeKnowledgeController {
  constructor(private readonly service: DigitalGenomeKnowledgeService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Get("records/:id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Post("records")
  create(
    @Body()
    body: Pick<DigitalGenomeKnowledgeRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeKnowledgeRecord,
          "genomeId" | "version" | "dnaAssets" | "domains" | "relationships" | "policies" | "metrics" | "healthScore"
        >
      >,
  ) {
    return this.service.create(body);
  }

  @Post("records/:id/activate")
  activate(@Param("id") id: string) {
    return this.service.activate(id);
  }

  @Post("records/:id/archive")
  archive(@Param("id") id: string) {
    return this.service.archive(id);
  }

  @Get("records/:id/assess")
  assess(@Param("id") id: string) {
    return this.service.assess(id);
  }
}