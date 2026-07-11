export declare class CreateRemediationDto {
    sourceType: "control_failure" | "compliance_drift" | "risk" | "incident";
    sourceId: string;
    title: string;
    description: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    owner: string;
    priority: number;
    dueAt?: string;
    actions?: string[];
}
