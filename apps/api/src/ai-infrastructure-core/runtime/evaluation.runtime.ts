import { Injectable } from "@nestjs/common";
@Injectable()
export class EvaluationRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "evaluation_"+Date.now(), input, status: "COMPLETED" };
  }
}
