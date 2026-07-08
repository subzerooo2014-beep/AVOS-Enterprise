export declare class ConversationMemoryService {
    private history;
    append(sessionId: string, message: any): any[];
    get(sessionId: string): any[];
    clear(sessionId: string): void;
}
