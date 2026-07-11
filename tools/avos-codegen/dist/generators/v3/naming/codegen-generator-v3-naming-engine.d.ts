import { CodeGenGeneratorV3Names, CodeGenGeneratorV3Request } from "../contracts/codegen-generator-v3.contracts";
export declare class CodeGenGeneratorV3NamingEngine {
    create(request: CodeGenGeneratorV3Request): CodeGenGeneratorV3Names;
    toWords(value: string): string[];
    toPascalCase(value: string): string;
    toCamelCase(value: string): string;
    toKebabCase(value: string): string;
    toConstantCase(value: string): string;
}
//# sourceMappingURL=codegen-generator-v3-naming-engine.d.ts.map