import { CodeGenArtifactDescriptor, CodeGenArtifactType } from "../../../artifacts/codegen-artifact.contracts";
export declare class CodeGenGeneratorV3ArtifactFactory {
    create(input: {
        id: string;
        key: string;
        type: CodeGenArtifactType;
        relativePath: string;
        content: string;
        dependencies?: string[];
        tags?: string[];
        metadata?: Record<string, string | number | boolean>;
    }): CodeGenArtifactDescriptor;
}
//# sourceMappingURL=codegen-generator-v3-artifact-factory.d.ts.map