import { AiAgent, AgentResult } from "./agent.interface";
export declare class BuyerMatchingAgent implements AiAgent {
    name: string;
    supports(taskType: string): taskType is "buyer_matching";
    execute(input: any): Promise<AgentResult>;
}
