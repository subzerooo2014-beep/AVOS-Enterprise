import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import {
  ExecuteLifecycleCommandDto,
  RecordHeartbeatDto,
  RecordServiceFailureDto
} from "./dto/platform-service-lifecycle.dto";
import { PlatformServiceLifecycleService } from "./services/platform-service-lifecycle.service";

@Controller("avos/platform/service-lifecycle")
export class PlatformServiceLifecycleController {
  constructor(
    private readonly lifecycle: PlatformServiceLifecycleService
  ) {}

  @Get("status")
  status() {
    return this.lifecycle.status();
  }

  @Get("health")
  health() {
    return this.lifecycle.health();
  }

  @Get("runtime")
  runtimeList() {
    return this.lifecycle.runtimeList();
  }

  @Get("runtime/:serviceId")
  runtimeStatus(@Param("serviceId") serviceId: string) {
    return this.lifecycle.runtimeStatus(serviceId);
  }

  @Post("services/:serviceId/commands")
  execute(
    @Param("serviceId") serviceId: string,
    @Body() dto: ExecuteLifecycleCommandDto
  ) {
    return this.lifecycle.execute(serviceId, dto);
  }

  @Post("services/:serviceId/heartbeat")
  heartbeat(
    @Param("serviceId") serviceId: string,
    @Body() dto: RecordHeartbeatDto
  ) {
    return this.lifecycle.recordHeartbeat(serviceId, dto);
  }

  @Post("services/:serviceId/failures")
  failure(
    @Param("serviceId") serviceId: string,
    @Body() dto: RecordServiceFailureDto
  ) {
    return this.lifecycle.recordFailure(serviceId, dto);
  }

  @Patch("failures/:failureId/resolve")
  resolveFailure(@Param("failureId") failureId: string) {
    return this.lifecycle.resolveFailure(failureId);
  }

  @Get("commands")
  commands(
    @Query("serviceId") serviceId?: string,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.lifecycle.commandHistory(serviceId, limit);
  }

  @Get("services/:serviceId/heartbeats")
  heartbeats(
    @Param("serviceId") serviceId: string,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.lifecycle.heartbeatHistory(serviceId, limit);
  }

  @Get("failures")
  failures(
    @Query("serviceId") serviceId?: string,
    @Query("unresolvedOnly", new ParseBoolPipe({ optional: true }))
    unresolvedOnly = false
  ) {
    return this.lifecycle.failureHistory(serviceId, unresolvedOnly);
  }

  @Get("services/:serviceId/diagnostics")
  diagnostics(@Param("serviceId") serviceId: string) {
    return this.lifecycle.diagnose(serviceId);
  }

  @Post("final-review/run")
  finalReview() {
    return this.lifecycle.finalReview();
  }

  @Post("certification/certify")
  certify() {
    return this.lifecycle.certify();
  }
}