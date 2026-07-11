export interface AgentResult {
    status: "success" | "failed";
    output: any;
    confidence?: number;
    reason?: string;
}
export interface AiAgent {
    name: string;
    supports(taskType: string): boolean;
    execute(input: any): Promise<AgentResult>;
}
