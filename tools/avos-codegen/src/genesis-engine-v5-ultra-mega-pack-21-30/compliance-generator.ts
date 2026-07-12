import {
  V5BusinessRuntimeInput,
  V5ComplianceControl,
} from "./contracts";

export class V5ComplianceRuntimeGenerator {
  controls(input: V5BusinessRuntimeInput): V5ComplianceControl[] {
    return input.complianceFrameworks.flatMap((framework) => [
      {
        key: `${framework}.access-control`,
        framework,
        objective: "restrict access to authorized identities",
        evidenceRequired: [
          "policy decision",
          "identity context",
          "access audit event",
        ],
        enforcement: "preventive",
      },
      {
        key: `${framework}.financial-integrity`,
        framework,
        objective: "preserve ledger and settlement integrity",
        evidenceRequired: [
          "ledger entries",
          "reconciliation result",
          "approval evidence",
        ],
        enforcement: "detective",
      },
      {
        key: `${framework}.incident-response`,
        framework,
        objective: "detect, respond, and recover from incidents",
        evidenceRequired: [
          "incident record",
          "runbook execution",
          "recovery verification",
        ],
        enforcement: "corrective",
      },
    ]);
  }

  regulatoryEvidence(input: V5BusinessRuntimeInput) {
    return {
      frameworks: input.complianceFrameworks,
      evidencePackages: [
        "access-control-evidence",
        "financial-integrity-evidence",
        "data-governance-evidence",
        "incident-response-evidence",
        "change-management-evidence",
      ],
      signingRequired: true,
      retentionYears: 7,
    };
  }
}
