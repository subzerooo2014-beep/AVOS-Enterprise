import { DependencyStatus } from "../enums/dependency-status.enum";
export interface DependencyCheckResult {
    name: string;
    status: DependencyStatus;
    critical: boolean;
    latencyMs: number;
    checkedAt: string;
    message?: string;
    metadata?: Record<string, unknown>;
}
