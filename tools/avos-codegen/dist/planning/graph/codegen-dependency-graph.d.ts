import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenDependencyGraphEdge, CodeGenDependencyGraphNode, CodeGenDependencyGraphSnapshot } from "./codegen-dependency-graph.contracts";
export declare class CodeGenDependencyGraph {
    private readonly nodes;
    private readonly edges;
    addArtifact(artifact: CodeGenArtifactDescriptor, replace?: boolean): CodeGenDependencyGraphNode;
    addArtifacts(artifacts: readonly CodeGenArtifactDescriptor[], replace?: boolean): CodeGenDependencyGraphNode[];
    getNode(key: string): CodeGenDependencyGraphNode;
    findNode(key: string): CodeGenDependencyGraphNode | undefined;
    listNodes(): CodeGenDependencyGraphNode[];
    listEdges(): CodeGenDependencyGraphEdge[];
    removeNode(key: string): CodeGenDependencyGraphNode;
    clear(): void;
    snapshot(): CodeGenDependencyGraphSnapshot;
    private rebuildEdges;
    private resolveArtifactWeight;
}
//# sourceMappingURL=codegen-dependency-graph.d.ts.map