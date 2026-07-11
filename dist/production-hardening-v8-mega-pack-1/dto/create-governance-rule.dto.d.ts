export declare class CreateGovernanceRuleDto {
    name: string;
    environment?: string;
    protectedServices?: string[];
    blockedDecisions?: Array<"monitor" | "scale_up" | "scale_down" | "throttle" | "reroute" | "restart_service" | "activate_recovery" | "block_change" | "no_action">;
    approvalRequiredDecisions?: Array<"monitor" | "scale_up" | "scale_down" | "throttle" | "reroute" | "restart_service" | "activate_recovery" | "block_change" | "no_action">;
    minimumConfidencePercent?: number;
    minimumHealthScore?: number;
}
