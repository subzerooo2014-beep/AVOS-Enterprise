import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeGraphRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "knowledge-graph_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
