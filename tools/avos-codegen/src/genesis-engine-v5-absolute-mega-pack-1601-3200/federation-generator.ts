import {
  V5AbsoluteInput,
  V5FederationNode,
} from "./contracts";

export class V5UniversalEnterpriseFederationGenerator {
  generate(input: V5AbsoluteInput): V5FederationNode[] {
    return input.federations.map((federation) => ({
      key: federation,
      members: input.worlds,
      consensusThreshold: 85,
      proofRequired: true,
    }));
  }

  agentCouncil(input: V5AbsoluteInput) {
    return {
      federations: input.federations,
      roles: [
        "planner",
        "guardian",
        "auditor",
        "scientist",
        "operator",
      ],
      consensusThreshold: 85,
      dissentEvidenceRequired: true,
    };
  }
}
