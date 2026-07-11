import { CodeGenValidationIssue } from "../contracts/codegen-validation.contracts";
export interface CodeGenValidationHealth {
    status: "healthy" | "degraded" | "unhealthy";
    errors: number;
    warnings: number;
    critical: number;
    checkedAt: string;
}
export declare class CodeGenValidationHealthAnalyzer {
    analyze(issues: readonly CodeGenValidationIssue[]): CodeGenValidationHealth;
}
//# sourceMappingURL=codegen-validation-health-analyzer.d.ts.map