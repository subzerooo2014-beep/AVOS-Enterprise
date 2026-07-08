export type AiProviderName = "openai" | "local" | "ollama";
export interface AiProviderRequest {
    prompt: string;
    systemPrompt?: string;
    context?: string;
    model?: string;
}
export interface AiProviderResponse {
    provider: AiProviderName;
    model: string;
    output: string;
    raw?: any;
}
