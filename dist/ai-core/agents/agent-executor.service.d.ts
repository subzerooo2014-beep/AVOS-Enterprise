import { AgentPlannerService } from "../planner/agent-planner.service";
import { ConversationMemoryService } from "../memory/conversation-memory.service";
import { ContextBuilderService } from "../context/context-builder.service";
export declare class AgentExecutorService {
    private planner;
    private memory;
    private context;
    constructor(planner: AgentPlannerService, memory: ConversationMemoryService, context: ContextBuilderService);
    execute(sessionId: string, input: any): {
        context: {
            input: any;
            history: any[];
            timestamp: string;
        };
        plan: import("./agent-task.interface").AgentTask;
        status: string;
    };
}
