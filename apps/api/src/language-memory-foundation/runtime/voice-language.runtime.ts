import { Injectable } from "@nestjs/common";

@Injectable()
export class VoiceLanguageRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "voice-language_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
