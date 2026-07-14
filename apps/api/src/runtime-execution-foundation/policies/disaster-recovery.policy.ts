import { Injectable } from "@nestjs/common";

@Injectable()
export class DisasterRecoveryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid disaster-recovery input");
    }
    return true;
  }
}
