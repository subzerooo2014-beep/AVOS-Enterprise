import { ChatRequest } from "../../shared/chat-request";
export declare class OpenAIChatService {
    chat(req: ChatRequest): Promise<import("openai/resources/responses/responses").Response & {
        _request_id?: string | null;
    }>;
}
