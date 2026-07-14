import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid agent input");
    }
    return true;
  }
}
