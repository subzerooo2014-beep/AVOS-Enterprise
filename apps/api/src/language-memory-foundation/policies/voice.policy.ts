import { Injectable } from "@nestjs/common";

@Injectable()
export class VoicePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid voice input");
    }
    return true;
  }
}
