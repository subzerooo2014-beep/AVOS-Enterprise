import { Injectable } from "@nestjs/common";
import { AuditLedgerService } from "./audit-ledger.service";
import { PolicyViolationRegistryService } from "./policy-violation-registry.service";
import { RuntimePolicyEngineService } from "./runtime-policy-engine.service";

@Injectable()
export class PlatformHardeningV5Service {
  constructor(
    private readonly ledger:
      AuditLedgerService,
    private readonly policies:
      RuntimePolicyEngineService,
    private readonly violations:
      PolicyViolationRegistryService,
  ) {}

  getStatus() {
    return {
      success: true,
      system:
        "AVOS Platform Hardening",
      version: "v5",
      phase:
        "security-governance-audit-integrity-and-runtime-policy",
      environment:
        process.env.NODE_ENV ??
        "development",
      capabilities: {
        immutableAuditLedger: true,
        auditHashChain: true,
        auditIntegrityVerification: true,
        runtimePolicyEngine: true,
        policyEnforcementModes: true,
        sensitiveOperationClassification: true,
        approvalTokenProtection: true,
        policyViolationRegistry: true,
        securityRiskScoring: true,
        protectedDiagnostics: true,
      },
      enforcementMode:
        this.policies.getMode(),
      timestamp:
        new Date().toISOString(),
      uptimeSeconds: Number(
        process.uptime().toFixed(3),
      ),
    };
  }

  getSnapshot() {
    const integrity =
      this.ledger.verifyIntegrity();

    return {
      success: true,
      system:
        "AVOS Enterprise Production",
      hardeningVersion: "v5",
      generatedAt:
        new Date().toISOString(),
      audit: {
        summary:
          this.ledger.getSummary(),
        integrity,
      },
      security: {
        risk:
          this.policies.getSecurityRiskSummary(),
        violations:
          this.violations.getSummary(),
      },
      policies:
        this.policies.findAll(),
    };
  }
}
