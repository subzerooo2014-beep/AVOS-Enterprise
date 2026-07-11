import { AiAgent, AgentResult } from "./agent.interface";
export declare class TrustProfileAgent implements AiAgent {
    name: string;
    supports(taskType: string): taskType is "trust_profile";
    execute(input: any): Promise<AgentResult>;
}
