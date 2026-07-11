import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { RuntimeSignalStatus } from "../contracts/runtime-resilience.enums";
import { RecordRuntimeSignalDto } from "../dto";
import { RuntimeSignalService } from "../services/runtime-signal.service";

@Controller("production-hardening-v8-mega-pack-3/signals")
export class RuntimeSignalController {
  constructor(
    private readonly signals: RuntimeSignalService,
  ) {}

  @Post()
  record(@Body() dto: RecordRuntimeSignalDto) {
    return this.signals.record(dto);
  }

  @Get()
  list(
    @Query("environment") environment?: string,
    @Query("namespace") namespace?: string,
    @Query("service") service?: string,
    @Query("status") status?: RuntimeSignalStatus,
  ) {
    return this.signals.list({
      environment,
      namespace,
      service,
      status,
    });
  }

  @Get("summary")
  summary(
    @Query("environment") environment?: string,
    @Query("namespace") namespace?: string,
    @Query("service") service?: string,
  ) {
    return this.signals.summarize({
      environment,
      namespace,
      service,
    });
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.signals.get(id);
  }
}
