export declare class GovernanceActorDto {
    id: string;
    type: "user" | "service" | "system" | "automation";
    name?: string;
    roles: string[];
    ipAddress?: string;
    userAgent?: string;
}
