import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  RuntimeGovernanceAuditService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/audit",
)
export class RuntimeGovernanceAuditController {
  constructor(
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  @Get()
  list() {
    return this.audit.list();
  }

  @Get("verify")
  verify() {
    return this.audit.verify();
  }
}
