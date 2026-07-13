import { Injectable } from "@nestjs/common";

@Injectable()
export class AiCollaborationMeshService {
  coordinate(input: {
    agentReadiness: number;
    dataQuality: number;
    taskFit: number;
    confidence: number;
  }) {
    const meshScore = Math.round(
      input.agentReadiness * 0.25 +
        input.dataQuality * 0.25 +
        input.taskFit * 0.3 +
        input.confidence * 0.2,
    );

    return {
      meshScore,
      mode: meshScore >= 80 ? "AUTONOMOUS" : meshScore >= 60 ? "ASSISTED" : "MANUAL",
    };
  }
}
