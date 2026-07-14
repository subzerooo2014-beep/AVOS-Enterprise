import { Injectable } from "@nestjs/common";
@Injectable()
export class FederationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid federation input");
    }
    return true;
  }
}
