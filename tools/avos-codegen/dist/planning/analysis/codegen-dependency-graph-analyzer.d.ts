import { CodeGenDependencyGraph } from "../graph/codegen-dependency-graph";
import { CodeGenGraphAnalysisResult } from "../graph/codegen-dependency-graph.contracts";
import { CodeGenGraphCycleDetector } from "../algorithms/codegen-graph-cycle-detector";
import { CodeGenGraphDepthAnalyzer } from "./codegen-graph-depth-analyzer";
import { CodeGenCriticalPathAnalyzer } from "./codegen-critical-path-analyzer";
export declare class CodeGenDependencyGraphAnalyzer {
    readonly cycles: CodeGenGraphCycleDetector;
    readonly depth: CodeGenGraphDepthAnalyzer;
    readonly criticalPath: CodeGenCriticalPathAnalyzer;
    constructor(cycles?: CodeGenGraphCycleDetector, depth?: CodeGenGraphDepthAnalyzer, criticalPath?: CodeGenCriticalPathAnalyzer);
    analyze(graph: CodeGenDependencyGraph): CodeGenGraphAnalysisResult;
}
//# sourceMappingURL=codegen-dependency-graph-analyzer.d.ts.map