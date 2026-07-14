import { Injectable } from "@nestjs/common";
import { AgentResult, AgentType, UserMemoryRecord } from "./super-app-v1.types";

@Injectable()
export class SuperAppAgentsService {
  run(agent: AgentType, intent: string, memory: UserMemoryRecord): AgentResult {
    const budget = memory.preferredBudget ?? 250000;

    const common = {
      success: true,
      score: 90,
      recommendations: [] as string[],
    };

    switch (agent) {
      case "VEHICLE":
        return {
          ...common,
          agent,
          score: 96,
          summary: `Found trusted vehicle options for: ${intent}`,
          recommendations: [
            `Prioritize options under AED ${budget}`,
            "Prefer trust score above 90%",
          ],
        };
      case "FINANCE":
        return {
          ...common,
          agent,
          score: 92,
          summary: "Finance scenarios prepared.",
          recommendations: [
            "Target down payment between 15% and 20%",
            "Compare 48 and 60 month terms",
          ],
        };
      case "INSURANCE":
        return {
          ...common,
          agent,
          score: 91,
          summary: "Insurance coverage comparison prepared.",
          recommendations: [
            "Compare comprehensive coverage",
            "Check agency repair option",
          ],
        };
      case "WORKSHOP":
        return {
          ...common,
          agent,
          score: 89,
          summary: "Inspection and workshop plan prepared.",
          recommendations: [
            "Book pre-purchase inspection",
            "Verify service history",
          ],
        };
      case "EXPORT":
        return {
          ...common,
          agent,
          score: 88,
          summary: "Export and logistics plan prepared.",
          recommendations: [
            "Validate destination regulations",
            "Compare shipping providers",
          ],
        };
      case "MARKET":
        return {
          ...common,
          agent,
          score: 94,
          summary: "Market demand and pricing signals analyzed.",
          recommendations: [
            "SUV demand is currently strong",
            "Prioritize listings below market average",
          ],
        };
      case "NEGOTIATION":
        return {
          ...common,
          agent,
          score: 90,
          summary: "Negotiation strategy generated.",
          recommendations: [
            "Start 4% below asking price",
            "Use inspection results as leverage",
          ],
        };
      case "TRUST":
        return {
          ...common,
          agent,
          score: 97,
          summary: "Trust assessment completed.",
          recommendations: [
            "Verify ownership records",
            "Prefer verified sellers",
          ],
        };
    }
  }

  runMesh(intent: string, memory: UserMemoryRecord): AgentResult[] {
    const agents: AgentType[] = [
      "VEHICLE",
      "FINANCE",
      "INSURANCE",
      "WORKSHOP",
      "MARKET",
      "NEGOTIATION",
      "TRUST",
    ];

    return agents.map((agent) => this.run(agent, intent, memory));
  }
}