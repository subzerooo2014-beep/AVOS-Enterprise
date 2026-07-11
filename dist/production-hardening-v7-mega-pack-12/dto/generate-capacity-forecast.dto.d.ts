export declare class GenerateCapacityForecastDto {
    serviceName: string;
    environment?: string;
    currentUtilizationPercent: number;
    currentRequests: number;
    requestGrowthPercent?: number;
    forecastWindowMinutes?: number;
    currentInstances?: number;
}
