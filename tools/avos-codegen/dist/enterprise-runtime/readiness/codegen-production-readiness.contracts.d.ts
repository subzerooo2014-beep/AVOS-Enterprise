export interface CodeGenProductionReadinessCheck {
    key: string;
    name: string;
    passed: boolean;
    critical: boolean;
    message: string;
}
export interface CodeGenProductionReadinessReport {
    ready: boolean;
    checks: CodeGenProductionReadinessCheck[];
    passed: number;
    failed: number;
    criticalFailures: number;
    score: number;
    generatedAt: string;
}
//# sourceMappingURL=codegen-production-readiness.contracts.d.ts.map