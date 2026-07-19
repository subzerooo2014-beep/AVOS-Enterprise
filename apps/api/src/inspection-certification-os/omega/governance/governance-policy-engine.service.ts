import { Injectable } from "@nestjs/common";

export interface GovernancePolicy {
  readonly id: string;
  readonly minimumTrust: number;
  readonly minimumExplainability: number;
  readonly minimumTraceability: number;
  readonly minimumProvenance: number;
  readonly requireHumanApproval: true;
}

@Injectable()
export class GovernancePolicyEngineService {
  private readonly policies: GovernancePolicy[] = [
    {
      id: "omega.governance.production",
      minimumTrust: 85,
      minimumExplainability: 80,
      minimumTraceability: 80,
      minimumProvenance: 80,
      requireHumanApproval: true,
    },
    {
      id: "omega.governance.enterprise-certification",
      minimumTrust: 90,
      minimumExplainability: 90,
      minimumTraceability: 90,
      minimumProvenance: 90,
      requireHumanApproval: true,
    },
    {
      id: "omega.governance.human-final-authority",
      minimumTrust: 100,
      minimumExplainability: 100,
      minimumTraceability: 100,
      minimumProvenance: 100,
      requireHumanApproval: true,
    },
  ];

  all(): readonly GovernancePolicy[] {
    return [...this.policies];
  }
}

