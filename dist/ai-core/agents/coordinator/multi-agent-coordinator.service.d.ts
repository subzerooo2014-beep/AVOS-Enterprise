import { AgentRegistryService } from "../registry/agent-registry.service";
import { AgentPlanner } from "../planner/agent-planner.service";
import { AgentExecutor } from "../executor/agent-executor.service";
export declare class MultiAgentCoordinator {
    private registry;
    private planner;
    private executor;
    constructor(registry: AgentRegistryService, planner: AgentPlanner, executor: AgentExecutor);
    run(agentId: string, goal: string): {
        agent: import("../registry/agent-definition").AgentDefinition | undefined;
        result: {
            status: string;
            completedSteps: any;
            plan: any;
        };
    };
}
