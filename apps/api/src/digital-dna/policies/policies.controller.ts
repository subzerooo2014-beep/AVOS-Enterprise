import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DigitalDnaPoliciesService } from "./policies.service";
import { DigitalDnaPoliciesRecord } from "./policies.types";

@Controller("digital-dna/policies")
export class DigitalDnaPoliciesController {
  constructor(private readonly service: DigitalDnaPoliciesService) {}

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
    body: Pick<DigitalDnaPoliciesRecord, "assetType" | "assetId" | "name" | "purpose" | "owner"> &
      Partial<
        Pick<
          DigitalDnaPoliciesRecord,
          "version" | "attributes" | "relations" | "policies" | "permissions" | "events" | "metrics"
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

  @Post("records/:id/version")
  updateVersion(@Param("id") id: string, @Body() body: { version: string }) {
    return this.service.updateVersion(id, body.version);
  }

  @Get("records/:id/validate")
  validate(@Param("id") id: string) {
    return this.service.validate(id);
  }
}