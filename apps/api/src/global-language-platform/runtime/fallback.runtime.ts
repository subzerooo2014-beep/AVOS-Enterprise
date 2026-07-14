import { Injectable } from "@nestjs/common";

@Injectable()
export class FallbackRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "fallback_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
