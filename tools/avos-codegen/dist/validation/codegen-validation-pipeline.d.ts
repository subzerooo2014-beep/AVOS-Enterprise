import { CodeGenValidationContext, CodeGenValidationPipelineResult, CodeGenValidator } from "./codegen-validation.contracts";
export declare class CodeGenValidationPipeline {
    private readonly validators;
    register(validator: CodeGenValidator, replace?: boolean): CodeGenValidator;
    get(key: string): CodeGenValidator;
    list(): readonly CodeGenValidator[];
    run(context: CodeGenValidationContext): Promise<CodeGenValidationPipelineResult>;
    remove(key: string): CodeGenValidator;
    clear(): void;
}
//# sourceMappingURL=codegen-validation-pipeline.d.ts.map