import { OpenAiProvider } from "./openai.provider";
import { LocalAiProvider } from "./local.provider";
import { OllamaProvider } from "./ollama.provider";
export declare class AiProviderRegistry {
    private openai;
    private local;
    private ollama;
    constructor(openai: OpenAiProvider, local: LocalAiProvider, ollama: OllamaProvider);
    get(provider?: string): OpenAiProvider | LocalAiProvider | OllamaProvider;
}
