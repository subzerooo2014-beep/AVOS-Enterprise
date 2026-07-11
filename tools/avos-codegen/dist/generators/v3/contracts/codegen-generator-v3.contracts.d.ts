import { CodeGenArtifactDescriptor } from "../../../artifacts/codegen-artifact.contracts";
import { CodeGenJsonValue, CodeGenMetadata } from "../../../core/codegen.contracts";
export type CodeGenGeneratorV3FieldType = "string" | "number" | "boolean" | "date" | "json" | "decimal" | "bigint";
export interface CodeGenGeneratorV3Field {
    name: string;
    type: CodeGenGeneratorV3FieldType;
    required: boolean;
    unique?: boolean;
    indexed?: boolean;
    defaultValue?: CodeGenJsonValue;
    maxLength?: number;
    description?: string;
}
export interface CodeGenGeneratorV3Request {
    moduleName: string;
    entityName?: string;
    routeName?: string;
    workspaceRoot: string;
    targetRoot: string;
    fields: CodeGenGeneratorV3Field[];
    includeController: boolean;
    includeService: boolean;
    includeDtos: boolean;
    includePrisma: boolean;
    includeTests: boolean;
    includeManifest: boolean;
    includeIndex: boolean;
    metadata?: CodeGenMetadata;
}
export interface CodeGenGeneratorV3Names {
    moduleName: string;
    entityName: string;
    routeName: string;
    pascalModule: string;
    pascalEntity: string;
    camelModule: string;
    camelEntity: string;
    kebabModule: string;
    kebabEntity: string;
    constantModule: string;
}
export interface CodeGenGeneratorV3Result {
    success: boolean;
    request: CodeGenGeneratorV3Request;
    names: CodeGenGeneratorV3Names;
    artifacts: CodeGenArtifactDescriptor[];
    warnings: string[];
    errors: string[];
    generatedAt: string;
}
export interface CodeGenGeneratorV3RendererContext {
    request: CodeGenGeneratorV3Request;
    names: CodeGenGeneratorV3Names;
}
//# sourceMappingURL=codegen-generator-v3.contracts.d.ts.map