export interface CodeGenSmokeCheck {
    key: string;
    success: boolean;
    details: string;
}
export interface CodeGenSmokeResult {
    success: boolean;
    checks: CodeGenSmokeCheck[];
    generatedFiles: number;
    blueprintKey: string;
    targetRoot: string;
    startedAt: string;
    completedAt: string;
}
//# sourceMappingURL=codegen-smoke.contracts.d.ts.map