import { CodeGenJsonValue, CodeGenMetadata, CodeGenVersion } from "../core/codegen.contracts";
import { CodeGenWriteMode } from "../filesystem/codegen-filesystem.contracts";
export declare enum CodeGenGeneratorStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DISABLED = "disabled",
    ARCHIVED = "archived"
}
export interface CodeGenGeneratedFile {
    relativePath: string;
    content: string;
    mode: CodeGenWriteMode;
}
export interface CodeGenGeneratorContext {
    workspaceRoot: string;
    targetRoot: string;
    variables: Record<string, CodeGenJsonValue>;
    dryRun: boolean;
    metadata: CodeGenMetadata;
}
export interface CodeGenGeneratorResult {
    generatorKey: string;
    success: boolean;
    files: CodeGenGeneratedFile[];
    warnings: string[];
    generatedAt: string;
}
export interface CodeGenGeneratorDescriptor {
    key: string;
    name: string;
    description: string;
    version: CodeGenVersion;
    status: CodeGenGeneratorStatus;
    capabilities: string[];
    metadata: CodeGenMetadata;
}
export interface CodeGenGenerator {
    readonly descriptor: CodeGenGeneratorDescriptor;
    generate(context: CodeGenGeneratorContext): Promise<CodeGenGeneratorResult> | CodeGenGeneratorResult;
}
//# sourceMappingURL=codegen-generator.contracts.d.ts.map