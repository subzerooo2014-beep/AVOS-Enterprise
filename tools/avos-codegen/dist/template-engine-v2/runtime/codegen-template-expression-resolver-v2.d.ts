import { CodeGenTemplateValue } from "../contracts/codegen-template-v2.contracts";
export declare class CodeGenTemplateExpressionResolverV2 {
    resolve(expression: string, scope: Record<string, CodeGenTemplateValue>): CodeGenTemplateValue | undefined;
    isTruthy(value: CodeGenTemplateValue | undefined): boolean;
    stringify(value: CodeGenTemplateValue | undefined): string;
}
//# sourceMappingURL=codegen-template-expression-resolver-v2.d.ts.map