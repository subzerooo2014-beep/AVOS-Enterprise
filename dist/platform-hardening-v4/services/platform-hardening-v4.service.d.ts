import { ResilienceStateService } from "./resilience-state.service";
import { SloManagementService } from "./slo-management.service";
import { TrafficProtectionService } from "./traffic-protection.service";
export declare class PlatformHardeningV4Service {
    private readonly resilience;
    private readonly traffic;
    private readonly slo;
    constructor(resilience: ResilienceStateService, traffic: TrafficProtectionService, slo: SloManagementService);
    getStatus(): {
        success: boolean;
        system: string;
        version: string;
        phase: string;
        environment: string;
        capabilities: {
            requestRateProtection: boolean;
            concurrencyProtection: boolean;
            loadShedding: boolean;
            maintenanceMode: boolean;
            brownoutMode: boolean;
            emergencyMode: boolean;
            serviceLevelObjectives: boolean;
            errorBudgetTracking: boolean;
            runtimeTrafficPolicies: boolean;
            protectedDiagnostics: boolean;
        };
        resilience: {
            mode: import("..").ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
        timestamp: string;
        uptimeSeconds: number;
    };
    getSnapshot(): {
        success: boolean;
        system: string;
        hardeningVersion: string;
        generatedAt: string;
        resilience: {
            mode: import("..").ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
        traffic: {
            policy: import("..").TrafficPolicy;
            state: {
                activeRequests: number;
                maximumConcurrentRequests: number;
                recentRequestCount: number;
                requestsPerMinuteLimit: number;
                concurrencyUsagePercent: number;
                loadSheddingActive: boolean;
                lastDecision: import("..").TrafficDecision;
                totalAllowed: number;
                totalRejected: number;
                rejectionReasons: {
                    [k: string]: number;
                };
            };
        };
        slo: {
            total: number;
            healthy: number;
            atRisk: number;
            breached: number;
            minimumErrorBudgetRemainingPercent: number;
            objectives: import("..").SloObjective[];
        };
        recentEvents: import("..").ResilienceEvent[];
    };
}
