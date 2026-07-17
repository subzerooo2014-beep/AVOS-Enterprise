import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DigitalGenomeEvolutionService } from "./evolution.service";
import { DigitalGenomeEvolutionRecord } from "./evolution.types";

@Controller("digital-genome/evolution")
export class DigitalGenomeEvolutionController {
  constructor(private readonly service: DigitalGenomeEvolutionService) {}

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
    body: Pick<DigitalGenomeEvolutionRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeEvolutionRecord,
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