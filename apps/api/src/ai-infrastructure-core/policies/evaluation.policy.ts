import { Injectable } from "@nestjs/common";
@Injectable()
export class EvaluationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid evaluation input");
    return true;
  }
}
