import { Injectable } from "@nestjs/common";

@Injectable()
export class SelfHealingPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid self-healing input");
    }
    return true;
  }
}
