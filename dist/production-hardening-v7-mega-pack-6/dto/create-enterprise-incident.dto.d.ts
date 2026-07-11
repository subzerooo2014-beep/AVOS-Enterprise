export declare class CreateEnterpriseIncidentDto {
    title: string;
    description: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    source: string;
    detectedAt?: string;
    commander?: string;
    affectedServices?: string[];
    businessImpact: string;
    technicalImpact: string;
    regulatoryImpact?: string;
    evidenceReferences?: string[];
    metadata?: Record<string, unknown>;
}
