import { CodeGenGenerationCoordinator } from "../../generation/codegen-generation-coordinator";
import { CodeGenConflictPolicy } from "../../output/codegen-output.contracts";
import { CodeGenOutputCoordinator } from "../../output/codegen-output-coordinator";
import { CodeGenBlueprintRuntimeExecutor } from "./codegen-blueprint-runtime-executor";
import { CodeGenBlueprintRuntimeResultBuilder } from "./codegen-blueprint-runtime-result-builder";
import { CodeGenBlueprintRuntimeRequest } from "./codegen-blueprint-runtime.contracts";
export declare class CodeGenBlueprintExecutionOrchestrator {
    readonly runtime: CodeGenBlueprintRuntimeExecutor;
    readonly generations: CodeGenGenerationCoordinator;
    readonly output: CodeGenOutputCoordinator;
    readonly results: CodeGenBlueprintRuntimeResultBuilder;
    constructor(runtime?: CodeGenBlueprintRuntimeExecutor, generations?: CodeGenGenerationCoordinator, output?: CodeGenOutputCoordinator, results?: CodeGenBlueprintRuntimeResultBuilder);
    execute(request: CodeGenBlueprintRuntimeRequest & {
        conflictPolicy?: CodeGenConflictPolicy;
    }): Promise<{
        success: boolean;
        runtime: import("./codegen-blueprint-runtime.contracts").CodeGenBlueprintRuntimeResult;
        generation: undefined;
        output: undefined;
    } | {
        success: boolean;
        runtime: import("./codegen-blueprint-runtime.contracts").CodeGenBlueprintRuntimeResult;
        generation: {
            session: import("../..").CodeGenGenerationSession;
            transaction: undefined;
            journal: import("../..").CodeGenGenerationJournalEntry[];
        } | {
            session: import("../..").CodeGenGenerationSession;
            transaction: import("../..").CodeGenGenerationTransactionSnapshot;
            journal: import("../..").CodeGenGenerationJournalEntry[];
        };
        output: {
            manifest: ReturnType<import("../..").CodeGenOutputManifestEngine["create"]>;
            report: import("../../output/codegen-output.contracts").CodeGenGenerationReport;
        };
    }>;
}
//# sourceMappingURL=codegen-blueprint-execution-orchestrator.d.ts.map