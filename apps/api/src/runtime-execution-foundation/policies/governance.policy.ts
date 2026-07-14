import { Injectable } from "@nestjs/common";

@Injectable()
export class GovernancePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid governance input");
    }
    return true;
  }
}
