import { CodeGenGenerationSessionInput } from "./codegen-generation.contracts";
import { CodeGenGenerationJournal } from "./journal/codegen-generation-journal";
import { CodeGenGenerationPlanner } from "./planning/codegen-generation-planner";
import { CodeGenGenerationSessionManager } from "./sessions/codegen-generation-session-manager";
export declare class CodeGenGenerationCoordinator {
    readonly sessions: CodeGenGenerationSessionManager;
    readonly planner: CodeGenGenerationPlanner;
    readonly journal: CodeGenGenerationJournal;
    constructor(sessions?: CodeGenGenerationSessionManager, planner?: CodeGenGenerationPlanner, journal?: CodeGenGenerationJournal);
    execute(input: CodeGenGenerationSessionInput & {
        artifacts: Parameters<CodeGenGenerationPlanner["createPlan"]>[0];
    }): Promise<{
        session: import("./codegen-generation.contracts").CodeGenGenerationSession;
        transaction: undefined;
        journal: import("./journal/codegen-generation-journal").CodeGenGenerationJournalEntry[];
    } | {
        session: import("./codegen-generation.contracts").CodeGenGenerationSession;
        transaction: import("./codegen-generation.contracts").CodeGenGenerationTransactionSnapshot;
        journal: import("./journal/codegen-generation-journal").CodeGenGenerationJournalEntry[];
    }>;
}
//# sourceMappingURL=codegen-generation-coordinator.d.ts.map