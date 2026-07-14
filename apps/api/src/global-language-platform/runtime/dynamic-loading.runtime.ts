import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicLoadingRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "dynamic-loading_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
