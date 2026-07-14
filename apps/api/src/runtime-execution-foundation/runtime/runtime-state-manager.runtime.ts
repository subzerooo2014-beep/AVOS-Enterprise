import { Injectable } from "@nestjs/common";

@Injectable()
export class RuntimeStateManagerRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "runtime-state-manager_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
