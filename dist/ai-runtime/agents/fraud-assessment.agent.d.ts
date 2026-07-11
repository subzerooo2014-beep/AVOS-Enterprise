import { AiAgent, AgentResult } from "./agent.interface";
export declare class FraudAssessmentAgent implements AiAgent {
    name: string;
    supports(taskType: string): taskType is "fraud_assessment";
    execute(input: any): Promise<AgentResult>;
}
