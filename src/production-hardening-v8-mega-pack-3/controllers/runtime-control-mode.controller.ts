import {
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { ChangeRuntimeControlModeDto } from "../dto";
import { RuntimeControlModeService } from "../services/runtime-control-mode.service";

@Controller("production-hardening-v8-mega-pack-3/control-mode")
export class RuntimeControlModeController {
  constructor(
    private readonly controlMode: RuntimeControlModeService,
  ) {}

  @Get()
  get() {
    return this.controlMode.get();
  }

  @Post()
  change(@Body() dto: ChangeRuntimeControlModeDto) {
    return this.controlMode.change(dto);
  }
}
