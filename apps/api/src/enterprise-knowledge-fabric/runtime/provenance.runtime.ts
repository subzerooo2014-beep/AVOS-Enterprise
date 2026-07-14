import { Injectable } from "@nestjs/common";
@Injectable()
export class ProvenanceRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "provenance_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
