import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  ProductionHardeningV8MegaPack4StatusService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4",
)
export class ProductionHardeningV8MegaPack4StatusController {
  constructor(
    private readonly status:
      ProductionHardeningV8MegaPack4StatusService,
  ) {}

  @Get("status")
  snapshot() {
    return this.status.snapshot();
  }

  @Get("health")
  health() {
    const snapshot =
      this.status.snapshot();

    return {
      success:
        snapshot.success,
      system:
        snapshot.system,
      version:
        snapshot.version,
      healthStatus:
        snapshot.healthStatus,
      evidenceChainVerified:
        snapshot.evidenceChainVerified,
      executionEvidenceVerified:
        snapshot.executionEvidenceVerified,
      controlMode:
        snapshot.controlMode,
      checkedAt:
        snapshot.generatedAt,
    };
  }
}
