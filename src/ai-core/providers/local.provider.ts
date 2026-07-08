import { Injectable } from "@nestjs/common";
import { AiProvider } from "./ai-provider.interface";
import { AiProviderRequest, AiProviderResponse } from "./types/ai-provider.types";

@Injectable()
export class LocalAiProvider implements AiProvider {
  name = "local";

  async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
    return {
      provider: "local",
      model: request.model || "local-default",
      output: "Local AI provider ready.",
      raw: request,
    };
  }
}
