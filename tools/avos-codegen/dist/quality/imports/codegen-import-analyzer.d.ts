export interface CodeGenImportRecord {
    source: string;
    specifiers: string[];
    typeOnly: boolean;
    line: number;
    raw: string;
}
export declare class CodeGenImportAnalyzer {
    analyze(content: string): CodeGenImportRecord[];
}
//# sourceMappingURL=codegen-import-analyzer.d.ts.map