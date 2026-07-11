import { AiAgent } from "./agent.interface";
export declare class AgentRegistryService {
    private readonly agents;
    find(taskType: string): AiAgent | undefined;
}
