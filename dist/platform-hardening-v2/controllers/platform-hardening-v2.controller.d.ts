import { CircuitBreakerService } from "../services/circuit-breaker.service";
import { DependencyHealthRegistryService } from "../services/dependency-health-registry.service";
import { OperationalReadinessService } from "../services/operational-readiness.service";
import { PlatformHardeningV2Service } from "../services/platform-hardening-v2.service";
import { RuntimeMetricsService } from "../services/runtime-metrics.service";
export declare class PlatformHardeningV2Controller {
    private readonly hardening;
    private readonly readiness;
    private readonly metrics;
    private readonly dependencies;
    private readonly circuits;
    constructor(hardening: PlatformHardeningV2Service, readiness: OperationalReadinessService, metrics: RuntimeMetricsService, dependencies: DependencyHealthRegistryService, circuits: CircuitBreakerService);
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
    getReadiness(): Promise<import("..").HealthSnapshot>;
    getOperationalSnapshot(): Promise<{
        success: boolean;
        system: string;
        hardeningVersion: string;
        readiness: import("..").HealthSnapshot;
        metrics: import("..").RuntimeMetrics;
        circuits: import("..").CircuitSnapshot[];
        generatedAt: string;
    }>;
    getRuntimeMetrics(): Promise<{
        success: boolean;
        metrics: import("..").RuntimeMetrics;
    }>;
    getDependencies(): Promise<{
        success: boolean;
        checks: import("..").DependencyCheckResult[];
    }>;
    getDependency(name: string): Promise<{
        success: boolean;
        check: import("..").DependencyCheckResult;
    }>;
    getCircuits(): {
        success: boolean;
        circuits: import("..").CircuitSnapshot[];
    };
    resetCircuit(name: string): {
        success: boolean;
        circuit: import("..").CircuitSnapshot;
    };
}
