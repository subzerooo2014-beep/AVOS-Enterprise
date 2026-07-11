import { DependencyHealthStatus } from "../contracts";
export declare class UpdateDependencyHealthDto {
    healthStatus: DependencyHealthStatus;
    healthScore: number;
    metadata?: Record<string, unknown>;
}
