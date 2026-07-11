import {
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import {
  ChangeGovernanceControlModeDto,
} from "../dto";
import {
  RuntimeGovernanceControlModeService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/control-mode",
)
export class RuntimeGovernanceControlModeController {
  constructor(
    private readonly controlMode:
      RuntimeGovernanceControlModeService,
  ) {}

  @Get()
  get() {
    return this.controlMode.get();
  }

  @Post()
  change(
    @Body()
    dto:
      ChangeGovernanceControlModeDto,
  ) {
    return this.controlMode.change(dto);
  }
}
