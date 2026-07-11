import { CodeGenDependencyGraph } from "../graph/codegen-dependency-graph";
export interface CodeGenTopologicalSortResult {
    valid: boolean;
    orderedKeys: string[];
    levels: string[][];
    unresolved: string[];
    generatedAt: string;
}
export declare class CodeGenTopologicalSorter {
    sort(graph: CodeGenDependencyGraph): CodeGenTopologicalSortResult;
    requireValid(graph: CodeGenDependencyGraph): CodeGenTopologicalSortResult;
}
//# sourceMappingURL=codegen-topological-sorter.d.ts.map