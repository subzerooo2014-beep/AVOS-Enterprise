import { GovernanceJsonValue, RuntimeRunbookStepDefinition } from "../contracts";
export declare class RuntimeRunbookStepExecutor {
    execute(input: {
        step: RuntimeRunbookStepDefinition;
        dryRun: boolean;
        runtimeContext: Record<string, GovernanceJsonValue>;
    }): Promise<{
        succeeded: boolean;
        output: Record<string, GovernanceJsonValue>;
        error?: string;
    }>;
}
