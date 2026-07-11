import { CodeGenPlanningDiagnostic } from "../contracts/codegen-planning.contracts";
import { CodeGenDependencyGraph } from "../graph/codegen-dependency-graph";
import { CodeGenDependencyGraphAnalyzer } from "../analysis/codegen-dependency-graph-analyzer";
export declare class CodeGenGraphDiagnostics {
    readonly analyzer: CodeGenDependencyGraphAnalyzer;
    constructor(analyzer?: CodeGenDependencyGraphAnalyzer);
    diagnose(graph: CodeGenDependencyGraph): CodeGenPlanningDiagnostic[];
}
//# sourceMappingURL=codegen-graph-diagnostics.d.ts.map