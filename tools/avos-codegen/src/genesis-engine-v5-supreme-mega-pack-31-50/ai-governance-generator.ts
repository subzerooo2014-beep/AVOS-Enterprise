import {
  V5AiGovernancePolicy,
  V5SupremeRuntimeInput,
} from "./contracts";

export class V5AiGovernanceGenerator {
  policies(input: V5SupremeRuntimeInput): V5AiGovernancePolicy[] {
    return input.aiAssets.map((asset) => ({
      assetKey: asset.key,
      approvalRequired: asset.riskLevel !== "low",
      evaluationGates: [
        "accuracy",
        "safety",
        "bias",
        "privacy",
        "robustness",
        "cost",
      ],
      monitoringRequired: true,
    }));
  }

  registry(input: V5SupremeRuntimeInput) {
    return {
      models: input.aiAssets
        .filter((asset) => asset.type === "model")
        .map((asset) => asset.key),
      prompts: input.aiAssets
        .filter((asset) => asset.type === "prompt")
        .map((asset) => asset.key),
      agents: input.aiAssets
        .filter((asset) => asset.type === "agent")
        .map((asset) => asset.key),
      versioningRequired: true,
      lineageRequired: true,
      rollbackSupported: true,
    };
  }
}
