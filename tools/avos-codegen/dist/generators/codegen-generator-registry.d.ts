import { CodeGenGenerator } from "./codegen-generator.contracts";
export declare class CodeGenGeneratorRegistry {
    private readonly generators;
    register(generator: CodeGenGenerator, replace?: boolean): CodeGenGenerator;
    get(key: string): CodeGenGenerator;
    list(): readonly CodeGenGenerator[];
    remove(key: string): CodeGenGenerator;
    clear(): void;
}
//# sourceMappingURL=codegen-generator-registry.d.ts.map