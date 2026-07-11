import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
export declare enum CodeGenGraphNodeState {
    READY = "ready",
    BLOCKED = "blocked",
    VISITING = "visiting",
    VISITED = "visited"
}
export interface CodeGenDependencyGraphNode {
    key: string;
    artifact: CodeGenArtifactDescriptor;
    incoming: string[];
    outgoing: string[];
    indegree: number;
    outdegree: number;
    depth: number;
    weight: number;
    state: CodeGenGraphNodeState;
    metadata: CodeGenMetadata;
}
export interface CodeGenDependencyGraphEdge {
    id: string;
    from: string;
    to: string;
    weight: number;
    optional: boolean;
    metadata: CodeGenMetadata;
}
export interface CodeGenDependencyGraphSnapshot {
    nodes: CodeGenDependencyGraphNode[];
    edges: CodeGenDependencyGraphEdge[];
    roots: string[];
    leaves: string[];
    isolated: string[];
    generatedAt: string;
}
export interface CodeGenGraphCycle {
    path: string[];
    signature: string;
}
export interface CodeGenCriticalPathResult {
    artifactKeys: string[];
    totalWeight: number;
    stages: number;
    generatedAt: string;
}
export interface CodeGenGraphAnalysisResult {
    valid: boolean;
    nodes: number;
    edges: number;
    roots: string[];
    leaves: string[];
    isolated: string[];
    cycles: CodeGenGraphCycle[];
    maximumDepth: number;
    criticalPath: CodeGenCriticalPathResult;
    warnings: string[];
    errors: string[];
    generatedAt: string;
}
//# sourceMappingURL=codegen-dependency-graph.contracts.d.ts.map