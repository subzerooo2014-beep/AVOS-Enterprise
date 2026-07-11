import { CodeGenTemplateDocumentNode } from "../contracts/codegen-template-v2.contracts";
export interface CodeGenTemplateCacheEntryV2 {
    key: string;
    sourceHash: string;
    ast: CodeGenTemplateDocumentNode;
    createdAt: string;
    updatedAt: string;
    hits: number;
}
export declare class CodeGenTemplateCacheV2 {
    private readonly entries;
    hash(source: string): string;
    get(key: string, source: string): CodeGenTemplateDocumentNode | undefined;
    put(key: string, source: string, ast: CodeGenTemplateDocumentNode): CodeGenTemplateCacheEntryV2;
    stats(): {
        entries: number;
        hits: number;
        generatedAt: string;
    };
    clear(): void;
}
//# sourceMappingURL=codegen-template-cache-v2.d.ts.map