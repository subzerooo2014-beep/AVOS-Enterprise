import { Injectable } from "@nestjs/common";
import { AiProvider } from "./ai-provider.interface";
import { AiProviderRequest, AiProviderResponse } from "./types/ai-provider.types";

@Injectable()
export class OpenAiProvider implements AiProvider {
  name = "openai";

  async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
    return {
      provider: "openai",
      model: request.model || "gpt-4.1-mini",
      output: "OpenAI provider ready. Add API integration next.",
      raw: request,
    };
  }
}
