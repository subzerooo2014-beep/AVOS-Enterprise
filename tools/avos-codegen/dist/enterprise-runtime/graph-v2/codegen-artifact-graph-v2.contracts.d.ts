import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
export interface CodeGenArtifactGraphV2Node {
    key: string;
    artifact: CodeGenArtifactDescriptor;
    dependencies: string[];
    dependents: string[];
    depth: number;
    root: boolean;
    leaf: boolean;
}
export interface CodeGenArtifactGraphV2 {
    nodes: CodeGenArtifactGraphV2Node[];
    roots: string[];
    leaves: string[];
    unresolvedDependencies: Record<string, string[]>;
    cycles: string[][];
    generatedAt: string;
}
//# sourceMappingURL=codegen-artifact-graph-v2.contracts.d.ts.map