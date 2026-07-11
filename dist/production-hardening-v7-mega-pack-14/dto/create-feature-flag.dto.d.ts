export declare class CreateFeatureFlagDto {
    key: string;
    name: string;
    description?: string;
    environment: "development" | "testing" | "staging" | "production";
    enabled?: boolean;
    rolloutPercentage?: number;
    allowedAudiences?: string[];
    createdBy?: string;
}
