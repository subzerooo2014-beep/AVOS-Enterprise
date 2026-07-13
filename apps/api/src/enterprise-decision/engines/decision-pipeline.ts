import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionPipeline {
  process(input: any) {
    return {
      success: true,
      decisionId: `decision-${Date.now()}`,
      status: "COMPLETED",
      input,
    };
  }
}
