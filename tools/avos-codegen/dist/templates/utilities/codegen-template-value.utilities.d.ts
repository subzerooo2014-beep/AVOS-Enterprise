import { CodeGenJsonValue } from "../../core/codegen.contracts";
export declare function resolveTemplateValue(variables: Record<string, CodeGenJsonValue>, path: string): CodeGenJsonValue | undefined;
export declare function stringifyTemplateValue(value: CodeGenJsonValue | undefined): string;
export declare function isTruthyTemplateValue(value: CodeGenJsonValue | undefined): boolean;
export declare function escapeHtml(value: string): string;
export declare function toWords(value: string): string[];
export declare function toPascalCase(value: string): string;
export declare function toCamelCase(value: string): string;
export declare function toKebabCase(value: string): string;
export declare function toSnakeCase(value: string): string;
export declare function toConstantCase(value: string): string;
export declare function toTitleCase(value: string): string;
export declare function indentText(value: string, size: number): string;
//# sourceMappingURL=codegen-template-value.utilities.d.ts.map