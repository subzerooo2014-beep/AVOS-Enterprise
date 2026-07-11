export declare class CreateReleaseDto {
    name: string;
    version: string;
    environment?: string;
    description?: string;
    strategy?: "rolling" | "blue_green" | "canary" | "recreate";
    requestedBy?: string;
}
