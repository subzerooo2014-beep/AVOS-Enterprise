export declare class CreateRollbackPlanDto {
    name?: string;
    targetVersion: string;
    automaticRollback?: boolean;
    maximumErrorRatePercent?: number;
    maximumLatencyMs?: number;
    minimumHealthPercent?: number;
}
