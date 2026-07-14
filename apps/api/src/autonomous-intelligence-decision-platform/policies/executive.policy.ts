import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutivePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid executive input");
    }
    return true;
  }
}
