import { AiProvider } from "./ai-provider.interface";
import { AiProviderRequest, AiProviderResponse } from "./types/ai-provider.types";
export declare class OllamaProvider implements AiProvider {
    name: string;
    generate(request: AiProviderRequest): Promise<AiProviderResponse>;
}
