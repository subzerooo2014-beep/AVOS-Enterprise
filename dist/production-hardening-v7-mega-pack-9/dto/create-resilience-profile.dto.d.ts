export declare class CreateResilienceProfileDto {
    name: string;
    description?: string;
    environment?: string;
    tags?: string[];
    objectives?: Array<{
        serviceName: string;
        recoveryTimeObjectiveMinutes: number;
        recoveryPointObjectiveMinutes: number;
        minimumAvailabilityPercent: number;
        maximumErrorRatePercent: number;
        priority?: number;
    }>;
}
