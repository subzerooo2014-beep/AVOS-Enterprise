import { Injectable } from "@nestjs/common";

@Injectable()
export class CrossLanguageRagRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "cross-language-rag_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
