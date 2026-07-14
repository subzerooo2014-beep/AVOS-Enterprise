import { Injectable } from "@nestjs/common";

@Injectable()
export class ConsensusRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "consensus_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
