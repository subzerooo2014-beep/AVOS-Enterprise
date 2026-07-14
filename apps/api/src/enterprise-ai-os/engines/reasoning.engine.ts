import { Injectable } from "@nestjs/common";
@Injectable()
export class ReasoningEngine {
  reason(input: { facts: string[]; rules: string[] }) {
    return {
      conclusion: input.facts.length > 0 ? "SUPPORTED" : "INSUFFICIENT_DATA",
      confidence: Math.min(100, input.facts.length * 10 + input.rules.length * 5),
      facts: input.facts,
      rules: input.rules,
    };
  }
}
