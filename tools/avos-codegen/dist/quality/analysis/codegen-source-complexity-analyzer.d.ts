export interface CodeGenSourceComplexity {
    lines: number;
    nonEmptyLines: number;
    imports: number;
    classes: number;
    functions: number;
    branches: number;
    estimatedComplexity: number;
}
export declare class CodeGenSourceComplexityAnalyzer {
    analyze(content: string): CodeGenSourceComplexity;
}
//# sourceMappingURL=codegen-source-complexity-analyzer.d.ts.map