import { AiAgent, AgentResult } from "./agent.interface";
export declare class MarketingCampaignAgent implements AiAgent {
    name: string;
    supports(taskType: string): taskType is "marketing_campaign";
    execute(input: any): Promise<AgentResult>;
}
