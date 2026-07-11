import { CodeGenJsonValue } from "../../core/codegen.contracts";
export type CodeGenTemplateHelper = (value: CodeGenJsonValue | undefined, args: string[]) => string;
export declare class CodeGenTemplateHelperRegistry {
    private readonly helpers;
    constructor();
    register(key: string, helper: CodeGenTemplateHelper, replace?: boolean): void;
    execute(key: string, value: CodeGenJsonValue | undefined, args?: string[]): string;
    has(key: string): boolean;
    list(): string[];
    private registerDefaults;
}
//# sourceMappingURL=codegen-template-helper-registry.d.ts.map