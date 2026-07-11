export declare class RuntimeActorDto {
    id: string;
    type: "user" | "service" | "system" | "automation";
    name?: string;
    roles?: string[];
    ipAddress?: string;
    userAgent?: string;
}
