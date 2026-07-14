import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerJourneyGenomeService {
  private readonly stages: Array<{ customerId: string; stage: string; intent: string }> = [];

  record(customerId: string, stage: string, intent: string) {
    const entry = { customerId, stage, intent };
    this.stages.push(entry);
    return entry;
  }

  predictNext(customerId: string) {
    const customerStages = this.stages.filter((item) => item.customerId === customerId);
    const latest = customerStages.length > 0 ? customerStages[customerStages.length - 1] : null;
    const next =
      !latest ? "discovery" :
      latest.stage === "discovery" ? "comparison" :
      latest.stage === "comparison" ? "negotiation" :
      latest.stage === "negotiation" ? "purchase" : "retention";

    return { customerId, currentStage: latest?.stage || "unknown", predictedNextStage: next };
  }

  count(): number {
    return this.stages.length;
  }
}