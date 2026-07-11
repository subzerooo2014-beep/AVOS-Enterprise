import { ResilienceMode } from "../enums/resilience-mode.enum";
import { PlatformHardeningV4Service } from "../services/platform-hardening-v4.service";
import { ResilienceStateService } from "../services/resilience-state.service";
import { SloManagementService } from "../services/slo-management.service";
import { TrafficProtectionService } from "../services/traffic-protection.service";
export declare class PlatformHardeningV4Controller {
    private readonly hardening;
    private readonly resilience;
    private readonly traffic;
    private readonly slo;
    constructor(hardening: PlatformHardeningV4Service, resilience: ResilienceStateService, traffic: TrafficProtectionService, slo: SloManagementService);
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
            mode: ResilienceMode;
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
            mode: ResilienceMode;
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
    getMode(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
    getTraffic(): {
        success: boolean;
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
    getSlo(): {
        success: boolean;
        slo: {
            total: number;
            healthy: number;
            atRisk: number;
            breached: number;
            minimumErrorBudgetRemainingPercent: number;
            objectives: import("..").SloObjective[];
        };
    };
    getEvents(): {
        success: boolean;
        events: import("..").ResilienceEvent[];
    };
    setMode(mode: string): {
        success: boolean;
        message: string;
        allowedModes: ResilienceMode[];
        resilience?: undefined;
    } | {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
        message?: undefined;
        allowedModes?: undefined;
    };
    enableMaintenance(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
    disableMaintenance(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
    enableBrownout(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
    disableBrownout(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
    enableEmergency(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
    disableEmergency(): {
        success: boolean;
        resilience: {
            mode: ResilienceMode;
            maintenanceReason: string | null;
            brownoutActive: boolean;
            maintenanceActive: boolean;
            emergencyActive: boolean;
            updatedAt: string;
        };
    };
}
