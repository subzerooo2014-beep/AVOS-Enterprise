import { Injectable } from "@nestjs/common";

@Injectable()
export class TrustPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid trust input");
    }
    return true;
  }
}
