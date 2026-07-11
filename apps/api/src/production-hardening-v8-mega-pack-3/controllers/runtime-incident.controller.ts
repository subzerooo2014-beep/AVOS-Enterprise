import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RuntimeIncidentStatus } from "../contracts/runtime-resilience.enums";
import {
  CreateRuntimeIncidentDto,
  UpdateRuntimeIncidentDto,
} from "../dto";
import { RuntimeIncidentService } from "../services/runtime-incident.service";

@Controller("production-hardening-v8-mega-pack-3/incidents")
export class RuntimeIncidentController {
  constructor(
    private readonly incidents: RuntimeIncidentService,
  ) {}

  @Post()
  create(@Body() dto: CreateRuntimeIncidentDto) {
    return this.incidents.create(dto);
  }

  @Get()
  list(
    @Query("status") status?: RuntimeIncidentStatus,
    @Query("environment") environment?: string,
    @Query("namespace") namespace?: string,
    @Query("service") service?: string,
  ) {
    return this.incidents.list({
      status,
      environment,
      namespace,
      service,
    });
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.incidents.get(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateRuntimeIncidentDto,
  ) {
    return this.incidents.update(id, dto);
  }
}
