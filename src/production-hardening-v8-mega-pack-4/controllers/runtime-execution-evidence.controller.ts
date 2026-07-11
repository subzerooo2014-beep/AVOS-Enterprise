import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  RuntimeExecutionEvidenceService,
  RuntimeExecutionStatusService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/execution",
)
export class RuntimeExecutionEvidenceController {
  constructor(
    private readonly evidence:
      RuntimeExecutionEvidenceService,
    private readonly status:
      RuntimeExecutionStatusService,
  ) {}

  @Get("evidence")
  listEvidence() {
    return this.evidence.list();
  }

  @Get("evidence/verify")
  verifyEvidence() {
    return this.evidence.verify();
  }

  @Get("status")
  snapshot() {
    return this.status.snapshot();
  }
}
