export declare class CreateIncidentDto {
    title: string;
    description?: string;
    severity: "sev1" | "sev2" | "sev3" | "sev4";
    serviceName: string;
    environment?: string;
    owner?: string;
    impactSummary?: string;
}
