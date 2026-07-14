import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslationMemoryRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "translation-memory_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
