import { Injectable } from "@nestjs/common";

@Injectable()
export class RecoveryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid recovery input");
    }
    return true;
  }
}
