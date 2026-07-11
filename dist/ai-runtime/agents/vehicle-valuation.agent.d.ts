import { AiAgent, AgentResult } from "./agent.interface";
export declare class VehicleValuationAgent implements AiAgent {
    name: string;
    supports(taskType: string): taskType is "vehicle_valuation";
    execute(input: any): Promise<AgentResult>;
}
