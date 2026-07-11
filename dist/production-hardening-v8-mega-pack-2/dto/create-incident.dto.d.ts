export declare class CreateIncidentDto {
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    description?: string;
}
