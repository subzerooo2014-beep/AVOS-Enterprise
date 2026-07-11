import { CodeGenEngine } from "../core/codegen.contracts";
export interface RegisterEngineOptions {
    replace?: boolean;
}
export declare class CodeGenEngineRegistry {
    private readonly engines;
    register(engine: CodeGenEngine, options?: RegisterEngineOptions): CodeGenEngine;
    get(key: string): CodeGenEngine;
    find(key: string): CodeGenEngine | undefined;
    has(key: string): boolean;
    remove(key: string): CodeGenEngine;
    list(): readonly CodeGenEngine[];
    listEnabled(): readonly CodeGenEngine[];
    count(): number;
    clear(): void;
    private validate;
}
//# sourceMappingURL=codegen-engine-registry.d.ts.map