import { HealthSnapshot } from "../interfaces/health-snapshot.interface";
import { DependencyHealthRegistryService } from "./dependency-health-registry.service";
export declare class OperationalReadinessService {
    private readonly dependencyRegistry;
    constructor(dependencyRegistry: DependencyHealthRegistryService);
    getLiveness(): {
        success: boolean;
        live: boolean;
        system: string;
        component: string;
        version: string;
        processId: number;
        uptimeSeconds: number;
        timestamp: string;
    };
    getReadiness(): Promise<HealthSnapshot>;
}
