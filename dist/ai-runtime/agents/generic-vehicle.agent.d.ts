import { AiAgent, AgentResult } from "./agent.interface";
export declare class GenericVehicleAgent implements AiAgent {
    name: string;
    supports(taskType: string): boolean;
    execute(input: any): Promise<AgentResult>;
}
