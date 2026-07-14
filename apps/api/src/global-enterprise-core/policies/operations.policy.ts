import { Injectable } from "@nestjs/common";

@Injectable()
export class OperationsPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid operations input");
    }
    return true;
  }
}
