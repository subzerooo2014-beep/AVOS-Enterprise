export declare class CreateRecoveryPlanDto {
    name: string;
    incidentPriority: "low" | "medium" | "high" | "critical";
    actions: Array<"restart_service" | "scale_up" | "scale_down" | "reroute_traffic" | "clear_cache" | "pause_deployments" | "activate_fallback" | "restore_checkpoint" | "isolate_dependency" | "monitor_only">;
    automaticExecution?: boolean;
    minimumConfidencePercent?: number;
}
