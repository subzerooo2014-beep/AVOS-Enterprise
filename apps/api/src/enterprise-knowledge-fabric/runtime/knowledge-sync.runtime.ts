import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeSyncRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "knowledge-sync_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
