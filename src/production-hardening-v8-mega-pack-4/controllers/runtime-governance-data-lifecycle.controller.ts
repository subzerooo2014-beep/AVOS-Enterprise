import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  RuntimeGovernanceDataLifecycleStatusService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/data-lifecycle",
)
export class RuntimeGovernanceDataLifecycleController {
  constructor(
    private readonly status:
      RuntimeGovernanceDataLifecycleStatusService,
  ) {}

  @Get("status")
  snapshot() {
    return this.status.snapshot();
  }
}
