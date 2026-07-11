import { AiActionService } from "./ai-action.service";
export declare class AiActionController {
    private readonly service;
    constructor(service: AiActionService);
    execute(id: string): Promise<{
        decision: string;
        actionsExecuted: string[];
        totalActions: number;
        success: boolean;
    }>;
}
