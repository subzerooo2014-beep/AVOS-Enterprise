import { CodeGenDependencyGraph } from "../graph/codegen-dependency-graph";
import { CodeGenGraphCycle } from "../graph/codegen-dependency-graph.contracts";
export declare class CodeGenGraphCycleDetector {
    detect(graph: CodeGenDependencyGraph): CodeGenGraphCycle[];
    private normalizeCycle;
}
//# sourceMappingURL=codegen-graph-cycle-detector.d.ts.map