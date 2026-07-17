import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DigitalGenomeCompositionService } from "./composition.service";
import { DigitalGenomeCompositionRecord } from "./composition.types";

@Controller("digital-genome/composition")
export class DigitalGenomeCompositionController {
  constructor(private readonly service: DigitalGenomeCompositionService) {}

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
    body: Pick<DigitalGenomeCompositionRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeCompositionRecord,
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