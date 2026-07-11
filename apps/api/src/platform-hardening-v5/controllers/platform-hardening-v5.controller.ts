import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PolicyEnforcementMode } from "../enums/policy-enforcement-mode.enum";
import { V5DiagnosticsTokenGuard } from "../guards/v5-diagnostics-token.guard";
import { AuditLedgerService } from "../services/audit-ledger.service";
import { PlatformHardeningV5Service } from "../services/platform-hardening-v5.service";
import { PolicyViolationRegistryService } from "../services/policy-violation-registry.service";
import { RuntimePolicyEngineService } from "../services/runtime-policy-engine.service";

@Controller("platform-hardening/v5")
export class PlatformHardeningV5Controller {
  constructor(
    private readonly hardening:
      PlatformHardeningV5Service,
    private readonly ledger:
      AuditLedgerService,
    private readonly policies:
      RuntimePolicyEngineService,
    private readonly violations:
      PolicyViolationRegistryService,
  ) {}

  @Get("status")
  getStatus() {
    return this.hardening.getStatus();
  }

  @Get("snapshot")
  @UseGuards(V5DiagnosticsTokenGuard)
  getSnapshot() {
    return this.hardening.getSnapshot();
  }

  @Get("audit")
  @UseGuards(V5DiagnosticsTokenGuard)
  getAudit(
    @Query("limit") limit?: string,
  ) {
    return {
      success: true,
      summary:
        this.ledger.getSummary(),
      events:
        this.ledger.findAll({
          limit:
            Number(limit) || 100,
        }),
    };
  }

  @Get("audit/integrity")
  @UseGuards(V5DiagnosticsTokenGuard)
  verifyAuditIntegrity() {
    return {
      success: true,
      integrity:
        this.ledger.verifyIntegrity(),
    };
  }

  @Get("audit/:id")
  @UseGuards(V5DiagnosticsTokenGuard)
  getAuditEvent(
    @Param("id") id: string,
  ) {
    const event =
      this.ledger.findOne(id);

    if (!event) {
      throw new NotFoundException({
        success: false,
        message:
          `Audit event ${id} was not found`,
      });
    }

    return {
      success: true,
      event,
    };
  }

  @Get("policies")
  @UseGuards(V5DiagnosticsTokenGuard)
  getPolicies() {
    return {
      success: true,
      enforcementMode:
        this.policies.getMode(),
      policies:
        this.policies.findAll(),
    };
  }

  @Post("policies/mode/audit-only")
  @UseGuards(V5DiagnosticsTokenGuard)
  setAuditOnlyMode() {
    return {
      success: true,
      enforcementMode:
        this.policies.setMode(
          PolicyEnforcementMode.AUDIT_ONLY,
        ),
    };
  }

  @Post("policies/mode/enforce")
  @UseGuards(V5DiagnosticsTokenGuard)
  setEnforceMode() {
    return {
      success: true,
      enforcementMode:
        this.policies.setMode(
          PolicyEnforcementMode.ENFORCE,
        ),
    };
  }

  @Post("policies/:id/enable")
  @UseGuards(V5DiagnosticsTokenGuard)
  enablePolicy(
    @Param("id") id: string,
  ) {
    const policy =
      this.policies.setEnabled(
        id,
        true,
      );

    if (!policy) {
      throw new NotFoundException({
        success: false,
        message:
          `Policy ${id} was not found`,
      });
    }

    return {
      success: true,
      policy,
    };
  }

  @Post("policies/:id/disable")
  @UseGuards(V5DiagnosticsTokenGuard)
  disablePolicy(
    @Param("id") id: string,
  ) {
    const policy =
      this.policies.setEnabled(
        id,
        false,
      );

    if (!policy) {
      throw new NotFoundException({
        success: false,
        message:
          `Policy ${id} was not found`,
      });
    }

    return {
      success: true,
      policy,
    };
  }

  @Get("violations")
  @UseGuards(V5DiagnosticsTokenGuard)
  getViolations(
    @Query("limit") limit?: string,
  ) {
    return {
      success: true,
      summary:
        this.violations.getSummary(),
      violations:
        this.violations.findAll(
          Number(limit) || 100,
        ),
    };
  }
}
