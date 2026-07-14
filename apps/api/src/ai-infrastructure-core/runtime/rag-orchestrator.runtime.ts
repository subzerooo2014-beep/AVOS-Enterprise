import { Injectable } from "@nestjs/common";
@Injectable()
export class RagOrchestratorRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "rag-orchestrator_"+Date.now(), input, status: "COMPLETED" };
  }
}
