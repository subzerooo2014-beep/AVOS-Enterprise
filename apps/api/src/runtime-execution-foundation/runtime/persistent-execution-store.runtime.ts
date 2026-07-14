import { Injectable } from "@nestjs/common";

@Injectable()
export class PersistentExecutionStoreRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "persistent-execution-store_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
