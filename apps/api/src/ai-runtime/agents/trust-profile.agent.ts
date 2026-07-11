import { AiAgent, AgentResult } from "./agent.interface";

export class TrustProfileAgent implements AiAgent {
  name = "TrustProfileAgent";

  supports(taskType: string) {
    return taskType === "trust_profile";
  }

  async execute(input: any): Promise<AgentResult> {
    let trustScore = 50;
    const positives: string[] = [];
    const risks: string[] = [];

    if (input?.vin) { trustScore += 15; positives.push("VIN_AVAILABLE"); }
    else { trustScore -= 15; risks.push("VIN_MISSING"); }

    if (input?.make && input?.model && input?.year) {
      trustScore += 15;
      positives.push("CORE_DATA_COMPLETE");
    } else {
      trustScore -= 20;
      risks.push("CORE_DATA_INCOMPLETE");
    }

    if (input?.status === "available") {
      trustScore += 10;
      positives.push("AVAILABLE_STATUS");
    }

    if (input?.location) {
      trustScore += 8;
      positives.push("LOCATION_AVAILABLE");
    }

    if (input?.dealerId || input?.showroomId) {
      trustScore += 12;
      positives.push("SELLER_CONTEXT_AVAILABLE");
    } else {
      risks.push("SELLER_CONTEXT_MISSING");
    }

    trustScore = Math.max(0, Math.min(100, trustScore));

    return {
      status: "success",
      confidence: 91,
      reason: "Trust profile calculated from vehicle completeness.",
      output: {
        trustScore,
        riskScore: 100 - trustScore,
        level: trustScore >= 80 ? "HIGH" : trustScore >= 60 ? "MEDIUM" : "LOW",
        positives,
        risks,
        trustModel: "AVOS-TRUST-V1"
      }
    };
  }
}
