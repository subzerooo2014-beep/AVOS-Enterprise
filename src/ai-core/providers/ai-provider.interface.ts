import { AiProviderRequest, AiProviderResponse } from "./types/ai-provider.types";

export interface AiProvider {
  name: string;
  generate(request: AiProviderRequest): Promise<AiProviderResponse>;
}
