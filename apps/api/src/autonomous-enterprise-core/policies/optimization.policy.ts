import { Injectable } from "@nestjs/common";

@Injectable()
export class OptimizationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid optimization input");
    }
    return true;
  }
}
