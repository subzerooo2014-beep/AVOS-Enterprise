import { Injectable } from "@nestjs/common";
import { AiProvider } from "./ai-provider.interface";
import { AiProviderRequest, AiProviderResponse } from "./types/ai-provider.types";

@Injectable()
export class OllamaProvider implements AiProvider {
  name = "ollama";

  async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
    return {
      provider: "ollama",
      model: request.model || "llama3",
      output: "Ollama provider ready.",
      raw: request,
    };
  }
}
