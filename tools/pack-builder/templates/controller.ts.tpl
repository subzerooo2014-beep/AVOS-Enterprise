import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { {{SERVICE_NAME}} } from "./{{MODULE_SLUG}}.service";
import { {{RECORD_NAME}} } from "./{{MODULE_SLUG}}.types";

@Controller("{{MODULE_SLUG}}")
export class {{CONTROLLER_NAME}} {
  constructor(private readonly service: {{SERVICE_NAME}}) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("records")
  createRecord(
    @Body()
    input: Omit<{{RECORD_NAME}}, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createRecord(input);
  }

  @Patch("records/:id/activate")
  activateRecord(@Param("id") id: string) {
    return this.service.activateRecord(id);
  }

  @Patch("records/:id/complete")
  completeRecord(@Param("id") id: string) {
    return this.service.completeRecord(id);
  }

  @Get("records")
  listRecords(@Query("tenantId") tenantId?: string) {
    return this.service.listRecords(tenantId);
  }

  @Get("command-center")
  commandCenter(@Query("tenantId") tenantId?: string) {
    return this.service.commandCenter(tenantId);
  }
}