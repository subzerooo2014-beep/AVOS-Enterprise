export declare class CreateControlDto {
    controlCode: string;
    name: string;
    description: string;
    framework: string;
    category: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    validationType: string;
    expectedValue?: unknown;
    enabled?: boolean;
    metadata?: Record<string, unknown>;
}
