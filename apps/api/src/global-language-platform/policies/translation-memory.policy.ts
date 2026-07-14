import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslationMemoryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid translation-memory input");
    }
    return true;
  }
}
