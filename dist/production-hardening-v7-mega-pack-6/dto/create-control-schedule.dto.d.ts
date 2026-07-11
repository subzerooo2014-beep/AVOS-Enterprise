export declare class CreateControlScheduleDto {
    scheduleCode: string;
    name: string;
    description: string;
    controlType: string;
    handler: string;
    frequency: "hourly" | "daily" | "weekly" | "monthly" | "manual";
    hour?: number;
    minute?: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
}
