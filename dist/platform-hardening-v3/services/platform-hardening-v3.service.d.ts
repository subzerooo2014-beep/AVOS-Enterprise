import { AlertRuleService } from "./alert-rule.service";
import { IncidentRegistryService } from "./incident-registry.service";
import { RequestMetricsService } from "./request-metrics.service";
export declare class PlatformHardeningV3Service {
    private readonly metrics;
    private readonly incidents;
    private readonly alerts;
    constructor(metrics: RequestMetricsService, incidents: IncidentRegistryService, alerts: AlertRuleService);
    getStatus(): {
        success: boolean;
        system: string;
        version: string;
        phase: string;
        environment: string;
        capabilities: {
            globalRequestCorrelation: boolean;
            distributedTraceContext: boolean;
            structuredEnterpriseLogging: boolean;
            requestResponseMetrics: boolean;
            slowRequestDetection: boolean;
            errorClassification: boolean;
            operationalIncidentRegistry: boolean;
            failureFingerprinting: boolean;
            runtimeAlertRules: boolean;
            protectedDiagnostics: boolean;
        };
        configuration: {
            slowRequestThresholdMs: number;
            diagnosticsProtection: boolean;
            diagnosticsHeader: string;
        };
        timestamp: string;
        uptimeSeconds: number;
    };
    getOperationalSnapshot(): {
        success: boolean;
        system: string;
        hardeningVersion: string;
        generatedAt: string;
        metrics: import("..").MetricsSnapshot;
        incidents: {
            total: number;
            open: number;
            acknowledged: number;
            resolved: number;
            critical: number;
            error: number;
            warning: number;
        };
        alerts: {
            total: number;
            triggered: number;
            rules: import("..").AlertRule[];
        };
    };
}
