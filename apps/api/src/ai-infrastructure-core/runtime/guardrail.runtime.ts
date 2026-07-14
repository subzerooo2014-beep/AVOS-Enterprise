import { Injectable } from "@nestjs/common";
@Injectable()
export class GuardrailRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "guardrail_"+Date.now(), input, status: "COMPLETED" };
  }
}
