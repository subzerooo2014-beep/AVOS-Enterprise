export declare class CreateBaselineControlDto {
    controlCode: string;
    name: string;
    description: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    comparisonType: "equals" | "not_equals" | "contains" | "exists" | "not_exists" | "greater_than" | "less_than" | "custom";
    expectedValue?: unknown;
    resourcePath: string;
    enabled?: boolean;
    metadata?: Record<string, unknown>;
}
export declare class CreateComplianceBaselineDto {
    baselineCode: string;
    name: string;
    description: string;
    domain: string;
    owner: string;
    version?: number;
    effectiveFrom?: string;
    effectiveUntil?: string;
    supersedesBaselineId?: string;
    controls: CreateBaselineControlDto[];
    metadata?: Record<string, unknown>;
}
