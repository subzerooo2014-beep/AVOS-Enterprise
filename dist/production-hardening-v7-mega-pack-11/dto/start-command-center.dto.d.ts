export declare class StartCommandCenterDto {
    name: string;
    reason: string;
    commander?: string;
    participants?: string[];
    status?: "normal" | "elevated" | "major_incident" | "critical_incident";
}
