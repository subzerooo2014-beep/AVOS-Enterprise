export interface ChatRequest {
    system: string;
    prompt: string;
    model: string;
    temperature?: number;
}
