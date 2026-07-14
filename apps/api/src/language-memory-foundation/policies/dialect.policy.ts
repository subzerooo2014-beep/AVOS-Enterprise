import { Injectable } from "@nestjs/common";

@Injectable()
export class DialectPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid dialect input");
    }
    return true;
  }
}
