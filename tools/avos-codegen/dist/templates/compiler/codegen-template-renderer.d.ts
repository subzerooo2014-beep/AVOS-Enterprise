import { CodeGenCompiledTemplate, CodeGenTemplateRenderContext, CodeGenTemplateRenderDiagnostics } from "../codegen-template.contracts";
import { CodeGenTemplateCompiler } from "./codegen-template-compiler";
import { CodeGenTemplateHelperRegistry } from "./codegen-template-helper-registry";
export declare class CodeGenTemplateRenderer {
    readonly compiler: CodeGenTemplateCompiler;
    readonly helpers: CodeGenTemplateHelperRegistry;
    constructor(compiler?: CodeGenTemplateCompiler, helpers?: CodeGenTemplateHelperRegistry);
    render(compiled: CodeGenCompiledTemplate, context: CodeGenTemplateRenderContext): {
        content: string;
        diagnostics: CodeGenTemplateRenderDiagnostics;
    };
    renderString(key: string, source: string, context: CodeGenTemplateRenderContext): string;
    private renderTokens;
    private renderVariable;
    private renderHelper;
    private renderPartial;
    private resolveValue;
    private splitExpression;
}
//# sourceMappingURL=codegen-template-renderer.d.ts.map