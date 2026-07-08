import { AgentDefinition } from "./agent-definition";
export declare class AgentRegistryService {
    private readonly agents;
    all(): AgentDefinition[];
    find(id: string): AgentDefinition | undefined;
}
