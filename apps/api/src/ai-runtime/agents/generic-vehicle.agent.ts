import { AiAgent, AgentResult } from "./agent.interface";

export class GenericVehicleAgent implements AiAgent {
  name = "GenericVehicleAgent";

  supports(taskType: string) {
    return [
      "trust_profile",
      "buyer_matching",
      "marketing_campaign",
      "export_opportunity_check",
    ].includes(taskType);
  }

  async execute(input: any): Promise<AgentResult> {
    return {
      status: "success",
      confidence: 75,
      reason: "Processed by generic vehicle intelligence agent.",
      output: {
        taskHandled: true,
        vehicleId: input?.vehicleId,
        make: input?.make,
        model: input?.model,
        year: input?.year,
      },
    };
  }
}
