import { CodeGenCompiledTemplate, CodeGenTemplateCacheSnapshot } from "../codegen-template.contracts";
export declare class CodeGenTemplateCache {
    private readonly entries;
    private hitCount;
    private missCount;
    get(key: string, checksum?: string): CodeGenCompiledTemplate | undefined;
    set(compiled: CodeGenCompiledTemplate): CodeGenCompiledTemplate;
    has(key: string, checksum?: string): boolean;
    remove(key: string): boolean;
    clear(): void;
    snapshot(): CodeGenTemplateCacheSnapshot;
}
//# sourceMappingURL=codegen-template-cache.d.ts.map