import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslationQualityRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "translation-quality_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
