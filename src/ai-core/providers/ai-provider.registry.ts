import { Injectable } from "@nestjs/common";
import { OpenAiProvider } from "./openai.provider";
import { LocalAiProvider } from "./local.provider";
import { OllamaProvider } from "./ollama.provider";

@Injectable()
export class AiProviderRegistry {
  constructor(
    private openai: OpenAiProvider,
    private local: LocalAiProvider,
    private ollama: OllamaProvider,
  ) {}

  get(provider?: string) {
    if (provider === "ollama") return this.ollama;
    if (provider === "local") return this.local;
    return this.openai;
  }
}
