import { CircuitBreakerService } from "./circuit-breaker.service";
import { DependencyHealthRegistryService } from "./dependency-health-registry.service";
import { OperationalReadinessService } from "./operational-readiness.service";
import { RuntimeMetricsService } from "./runtime-metrics.service";
export declare class PlatformHardeningV2Service {
    private readonly readiness;
    private readonly metrics;
    private readonly dependencyRegistry;
    private readonly circuitBreaker;
    constructor(readiness: OperationalReadinessService, metrics: RuntimeMetricsService, dependencyRegistry: DependencyHealthRegistryService, circuitBreaker: CircuitBreakerService);
    getStatus(): {
        success: boolean;
        system: string;
        version: string;
        phase: string;
        environment: string;
        live: boolean;
        capabilities: {
            livenessChecks: boolean;
            readinessChecks: boolean;
            dependencyHealthRegistry: boolean;
            runtimeMetrics: boolean;
            timeoutProtection: boolean;
            retryPolicies: boolean;
            circuitBreakers: boolean;
            degradedStateDetection: boolean;
            databaseProbe: boolean;
            eventLoopProbe: boolean;
            memoryProbe: boolean;
        };
        registeredDependencyChecks: {
            name: string;
            critical: boolean;
            timeoutMs: number;
        }[];
        timestamp: string;
        uptimeSeconds: number;
    };
    getOperationalSnapshot(): Promise<{
        success: boolean;
        system: string;
        hardeningVersion: string;
        readiness: import("..").HealthSnapshot;
        metrics: import("..").RuntimeMetrics;
        circuits: import("..").CircuitSnapshot[];
        generatedAt: string;
    }>;
}
