import { CodeGenDependencyGraph } from "../graph/codegen-dependency-graph";
import { CodeGenCriticalPathResult } from "../graph/codegen-dependency-graph.contracts";
import { CodeGenTopologicalSorter } from "../algorithms/codegen-topological-sorter";
export declare class CodeGenCriticalPathAnalyzer {
    readonly sorter: CodeGenTopologicalSorter;
    constructor(sorter?: CodeGenTopologicalSorter);
    analyze(graph: CodeGenDependencyGraph): CodeGenCriticalPathResult;
}
//# sourceMappingURL=codegen-critical-path-analyzer.d.ts.map