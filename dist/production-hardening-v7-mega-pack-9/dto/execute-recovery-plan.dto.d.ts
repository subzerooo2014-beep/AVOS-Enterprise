export declare class ExecuteRecoveryPlanDto {
    reason?: string;
    requestedBy?: string;
    forceDecision?: "no_action" | "monitor" | "degrade_service" | "restart_component" | "failover" | "restore_checkpoint" | "isolate_dependency" | "escalate";
}
