import { Injectable } from "@nestjs/common";
import { FindingRegistryService } from "./finding-registry.service";
import { IssueRegistryService } from "./issue-registry.service";
import { RemediationEngineService } from "./remediation-engine.service";

@Injectable()
export class OmegaRemediationFacadeService {
  constructor(
    private readonly engine: RemediationEngineService,
    private readonly findings: FindingRegistryService,
    private readonly issues: IssueRegistryService,
  ) {}

  status() {
    return {
      system: "AVOS Omega Remediation Core",
      pack: "Mega Pack Omega-1 Part 4A",
      version: "2.0.0-omega.4a",
      status: "healthy",
      capabilities: 7,
      humanFinalAuthority: true,
      autonomousFinalApproval: false,
      destructiveAutoFix: false,
      next: "Omega-1 Part 4B",
    };
  }

  generatePlan() {
    return this.engine.plan();
  }

  latest() {
    return {
      available: this.engine.latest() !== null,
      plan: this.engine.latest(),
    };
  }

  registry() {
    return {
      findings: this.findings.all(),
      issues: this.issues.all(),
    };
  }
}
