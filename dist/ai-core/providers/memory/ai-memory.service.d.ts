export declare class AiMemoryService {
    private sessions;
    add(sessionId: string, role: string, content: string): any[];
    get(sessionId: string): any[];
    clear(sessionId: string): void;
}
