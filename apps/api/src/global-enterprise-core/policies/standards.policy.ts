import { Injectable } from "@nestjs/common";

@Injectable()
export class StandardsPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid standards input");
    }
    return true;
  }
}
