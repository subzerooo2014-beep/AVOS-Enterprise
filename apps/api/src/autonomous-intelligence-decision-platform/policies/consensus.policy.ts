import { Injectable } from "@nestjs/common";

@Injectable()
export class ConsensusPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid consensus input");
    }
    return true;
  }
}
