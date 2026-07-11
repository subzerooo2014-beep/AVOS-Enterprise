import { CodeGenUnifiedGenerationMode, CodeGenUnifiedGenerationResult } from "../requests/codegen-unified-generation.contracts";
export declare class CodeGenUnifiedGenerationResultBuilder {
    build(input: {
        success: boolean;
        mode: CodeGenUnifiedGenerationMode;
        key: string;
        artifacts: CodeGenUnifiedGenerationResult["artifacts"];
        manifest?: CodeGenUnifiedGenerationResult["manifest"];
        report?: CodeGenUnifiedGenerationResult["report"];
        warnings?: string[];
        errors?: string[];
        startedAt: string;
    }): CodeGenUnifiedGenerationResult;
}
//# sourceMappingURL=codegen-unified-generation-result-builder.d.ts.map