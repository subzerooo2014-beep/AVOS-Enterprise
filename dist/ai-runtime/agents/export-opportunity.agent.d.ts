import { AiAgent, AgentResult } from "./agent.interface";
export declare class ExportOpportunityAgent implements AiAgent {
    name: string;
    supports(taskType: string): taskType is "export_opportunity_check";
    execute(input: any): Promise<AgentResult>;
}
