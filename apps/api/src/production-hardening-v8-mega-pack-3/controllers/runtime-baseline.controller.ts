import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { CaptureRuntimeBaselineDto } from "../dto";
import { RuntimeBaselineService } from "../services/runtime-baseline.service";

@Controller("production-hardening-v8-mega-pack-3/baselines")
export class RuntimeBaselineController {
  constructor(
    private readonly baselines: RuntimeBaselineService,
  ) {}

  @Post()
  capture(@Body() dto: CaptureRuntimeBaselineDto) {
    return this.baselines.capture(dto);
  }

  @Get()
  list() {
    return this.baselines.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.baselines.get(id);
  }

  @Get(":id/verify")
  verify(@Param("id") id: string) {
    return this.baselines.verify(id);
  }
}
