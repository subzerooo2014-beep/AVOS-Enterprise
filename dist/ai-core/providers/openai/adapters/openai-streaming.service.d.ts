export declare class OpenAIStreamingService {
    stream(model: string, system: string, prompt: string): Promise<import("openai/core/streaming").Stream<import("openai/resources/responses/responses").ResponseStreamEvent> & {
        _request_id?: string | null;
    }>;
}
