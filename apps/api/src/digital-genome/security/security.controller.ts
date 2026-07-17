import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DigitalGenomeSecurityService } from "./security.service";
import { DigitalGenomeSecurityRecord } from "./security.types";

@Controller("digital-genome/security")
export class DigitalGenomeSecurityController {
  constructor(private readonly service: DigitalGenomeSecurityService) {}

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
    body: Pick<DigitalGenomeSecurityRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeSecurityRecord,
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