export interface ComplianceFinding {
    id: string;
    category: string;
    severity: "info" | "warning" | "error" | "critical";
    title: string;
    description: string;
    compliant: boolean;
    evidence?: Record<string, unknown>;
}
export interface ComplianceReportPayload {
    reportType: string;
    status: "compliant" | "attention_required" | "compromised";
    title: string;
    generatedAt: string;
    summary: {
        compliantChecks: number;
        warningChecks: number;
        failedChecks: number;
        totalChecks: number;
    };
    findings: ComplianceFinding[];
    recommendations: string[];
    metrics: Record<string, unknown>;
}
