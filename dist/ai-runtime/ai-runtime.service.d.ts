import { AgentRegistryService } from "./agents/agent-registry.service";
export declare class AiRuntimeService {
    private readonly registry;
    constructor(registry: AgentRegistryService);
    run(taskType: string, input: any): Promise<import("./agents/agent.interface").AgentResult | {
        status: string;
        output: null;
        confidence: number;
        reason: string;
    }>;
}
