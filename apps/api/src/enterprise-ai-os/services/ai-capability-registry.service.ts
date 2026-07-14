import { Injectable } from "@nestjs/common";
@Injectable()
export class AiCapabilityRegistryService {
  capabilities() {
    return [
      "PLANNING",
      "REASONING",
      "DECISION",
      "RECOMMENDATION",
      "MEMORY",
      "KNOWLEDGE_GRAPH",
      "WORKFLOW",
      "LEARNING",
      "SIMULATION",
      "GOVERNANCE",
    ];
  }
}
