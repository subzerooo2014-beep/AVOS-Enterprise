import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyEngine {
  evaluate(input: any) {
    return {
      allowed: true,
      policyVersion: "1.0.0",
      input,
    };
  }
}
