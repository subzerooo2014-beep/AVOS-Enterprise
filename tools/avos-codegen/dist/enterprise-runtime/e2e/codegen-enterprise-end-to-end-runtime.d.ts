import { CodeGenEnterpriseRuntimeOrchestrator } from "../orchestration/codegen-enterprise-runtime-orchestrator";
import { CodeGenProductionReadinessAnalyzer } from "../readiness/codegen-production-readiness-analyzer";
import { CodeGenFinalDiagnosticsAggregator } from "../finalization/codegen-final-diagnostics-aggregator";
import { CodeGenEnterpriseEndToEndRequest, CodeGenEnterpriseEndToEndResult } from "./codegen-enterprise-e2e.contracts";
export declare class CodeGenEnterpriseEndToEndRuntime {
    readonly orchestrator: CodeGenEnterpriseRuntimeOrchestrator;
    readonly readiness: CodeGenProductionReadinessAnalyzer;
    readonly diagnostics: CodeGenFinalDiagnosticsAggregator;
    constructor(orchestrator?: CodeGenEnterpriseRuntimeOrchestrator, readiness?: CodeGenProductionReadinessAnalyzer, diagnostics?: CodeGenFinalDiagnosticsAggregator);
    execute(request: CodeGenEnterpriseEndToEndRequest): Promise<CodeGenEnterpriseEndToEndResult>;
}
//# sourceMappingURL=codegen-enterprise-end-to-end-runtime.d.ts.map