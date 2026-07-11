export declare class CreateRecoveryPlanDto {
    profileId: string;
    name: string;
    description?: string;
    triggerTypes?: string[];
    approvalRequired?: boolean;
    steps?: Array<{
        name: string;
        description?: string;
        action: "health_check" | "restart" | "failover" | "restore" | "isolate" | "notify" | "verify";
        target: string;
        timeoutSeconds?: number;
        required?: boolean;
    }>;
}
