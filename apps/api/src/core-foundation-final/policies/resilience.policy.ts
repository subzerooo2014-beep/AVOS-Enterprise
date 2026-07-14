import { Injectable } from "@nestjs/common";

@Injectable()
export class ResiliencePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid resilience input");
    }
    return true;
  }
}
