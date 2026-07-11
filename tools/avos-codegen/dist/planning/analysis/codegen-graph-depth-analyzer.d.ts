import { CodeGenDependencyGraph } from "../graph/codegen-dependency-graph";
export interface CodeGenGraphDepthResult {
    depths: Record<string, number>;
    maximumDepth: number;
    deepestNodes: string[];
    generatedAt: string;
}
export declare class CodeGenGraphDepthAnalyzer {
    analyze(graph: CodeGenDependencyGraph): CodeGenGraphDepthResult;
}
//# sourceMappingURL=codegen-graph-depth-analyzer.d.ts.map