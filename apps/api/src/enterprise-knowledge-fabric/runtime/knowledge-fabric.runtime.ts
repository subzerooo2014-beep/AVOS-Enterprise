import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeFabricRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "knowledge-fabric_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
