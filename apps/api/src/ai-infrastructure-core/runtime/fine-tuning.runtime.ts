import { Injectable } from "@nestjs/common";
@Injectable()
export class FineTuningRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "fine-tuning_"+Date.now(), input, status: "COMPLETED" };
  }
}
