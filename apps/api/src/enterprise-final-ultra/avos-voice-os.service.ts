import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { VoiceCapability } from "./enterprise-final-ultra.types";

@Injectable()
export class AvosVoiceOsService {
  private readonly capabilities: VoiceCapability[] = [];

  enable(name: string, language: string): VoiceCapability {
    const capability: VoiceCapability = {
      id: randomUUID(),
      name,
      language,
      enabled: true,
    };

    this.capabilities.push(capability);
    return capability;
  }

  readiness() {
    return {
      capabilities: this.capabilities.length,
      multilingual: this.capabilities.some((item) => item.language !== "en"),
      ready: this.capabilities.length >= 3,
      score: this.capabilities.length >= 3 ? 96 : 60,
    };
  }

  count(): number {
    return this.capabilities.length;
  }
}