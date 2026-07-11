import { CodeGenCompiledTemplate } from "../codegen-template.contracts";
export interface CompileCodeGenTemplateInput {
    key: string;
    source: string;
}
export declare class CodeGenTemplateCompiler {
    compile(input: CompileCodeGenTemplateInput): CodeGenCompiledTemplate;
    checksum(source: string): string;
    private tokenize;
    private resolveTokenType;
    private createToken;
    private validateBlockBalance;
    private extractReferencedVariable;
    private splitExpression;
}
//# sourceMappingURL=codegen-template-compiler.d.ts.map