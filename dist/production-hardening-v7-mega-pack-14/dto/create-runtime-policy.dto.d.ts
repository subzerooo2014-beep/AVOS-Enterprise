export declare class CreateRuntimePolicyDto {
    name: string;
    environment: "development" | "testing" | "staging" | "production";
    description?: string;
    requiresApproval?: boolean;
    blockedKeys?: string[];
    protectedKeys?: string[];
    minimumHealthPercent?: number;
}
