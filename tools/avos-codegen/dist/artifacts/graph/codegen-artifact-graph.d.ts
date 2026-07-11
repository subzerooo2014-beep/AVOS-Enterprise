import { CodeGenArtifactDescriptor, CodeGenArtifactGraphSnapshot, CodeGenArtifactNode, CodeGenArtifactStatus } from "../codegen-artifact.contracts";
export declare class CodeGenArtifactGraph {
    private readonly nodes;
    add(artifact: CodeGenArtifactDescriptor, replace?: boolean): CodeGenArtifactNode;
    addMany(artifacts: readonly CodeGenArtifactDescriptor[], replace?: boolean): CodeGenArtifactNode[];
    get(key: string): CodeGenArtifactNode;
    find(key: string): CodeGenArtifactNode | undefined;
    list(): CodeGenArtifactNode[];
    updateStatus(key: string, status: CodeGenArtifactStatus, blockedBy?: string[]): CodeGenArtifactNode;
    remove(key: string): CodeGenArtifactNode;
    clear(): void;
    snapshot(): CodeGenArtifactGraphSnapshot;
    private rebuildRelationships;
    private requireNode;
}
//# sourceMappingURL=codegen-artifact-graph.d.ts.map