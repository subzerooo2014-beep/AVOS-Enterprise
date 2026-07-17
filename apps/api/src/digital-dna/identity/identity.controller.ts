import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DigitalDnaIdentityService } from "./identity.service";
import { DigitalDnaIdentityRecord } from "./identity.types";

@Controller("digital-dna/identity")
export class DigitalDnaIdentityController {
  constructor(private readonly service: DigitalDnaIdentityService) {}

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
    body: Pick<DigitalDnaIdentityRecord, "assetType" | "assetId" | "name" | "purpose" | "owner"> &
      Partial<
        Pick<
          DigitalDnaIdentityRecord,
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