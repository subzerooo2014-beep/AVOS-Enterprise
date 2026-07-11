import { CodeGenJsonValue, CodeGenMetadata } from "../core/codegen.contracts";
import { CodeGenWriteMode } from "../filesystem/codegen-filesystem.contracts";
export declare enum CodeGenArtifactType {
    SOURCE = "source",
    TEST = "test",
    DOCUMENTATION = "documentation",
    CONFIGURATION = "configuration",
    MANIFEST = "manifest",
    SCHEMA = "schema",
    MIGRATION = "migration",
    ASSET = "asset",
    CUSTOM = "custom"
}
export declare enum CodeGenArtifactStatus {
    PLANNED = "planned",
    READY = "ready",
    BLOCKED = "blocked",
    GENERATED = "generated",
    WRITTEN = "written",
    SKIPPED = "skipped",
    FAILED = "failed",
    ROLLED_BACK = "rolled_back"
}
export interface CodeGenArtifactDescriptor {
    id: string;
    key: string;
    type: CodeGenArtifactType;
    relativePath: string;
    content: string;
    writeMode: CodeGenWriteMode;
    dependencies: string[];
    tags: string[];
    metadata: CodeGenMetadata;
    checksum?: string;
}
export interface CodeGenArtifactNode {
    artifact: CodeGenArtifactDescriptor;
    status: CodeGenArtifactStatus;
    blockedBy: string[];
    dependents: string[];
    createdAt: string;
    updatedAt: string;
}
export interface CodeGenArtifactGraphSnapshot {
    artifacts: number;
    edges: number;
    roots: string[];
    leaves: string[];
    blocked: string[];
    generatedAt: string;
}
export interface CodeGenResolvedArtifactPlan {
    orderedArtifacts: CodeGenArtifactDescriptor[];
    levels: string[][];
    unresolvedDependencies: Array<{
        artifactKey: string;
        dependencyKey: string;
    }>;
    circularDependencies: string[][];
    valid: boolean;
    generatedAt: string;
}
export interface CodeGenArtifactExecutionRecord {
    artifactKey: string;
    status: CodeGenArtifactStatus;
    absolutePath?: string;
    checksum?: string;
    bytes?: number;
    error?: string;
    metadata: Record<string, CodeGenJsonValue>;
    startedAt: string;
    completedAt: string;
}
//# sourceMappingURL=codegen-artifact.contracts.d.ts.map