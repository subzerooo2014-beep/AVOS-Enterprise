import { AlertRuleService } from "../services/alert-rule.service";
import { IncidentRegistryService } from "../services/incident-registry.service";
import { PlatformHardeningV3Service } from "../services/platform-hardening-v3.service";
import { RequestMetricsService } from "../services/request-metrics.service";
export declare class PlatformHardeningV3Controller {
    private readonly hardening;
    private readonly metrics;
    private readonly incidents;
    private readonly alerts;
    constructor(hardening: PlatformHardeningV3Service, metrics: RequestMetricsService, incidents: IncidentRegistryService, alerts: AlertRuleService);
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
    getSnapshot(): {
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
    getMetrics(): {
        success: boolean;
        metrics: import("..").MetricsSnapshot;
    };
    getRecentMetrics(limit?: number): {
        success: boolean;
        metrics: import("..").RequestMetric[];
    };
    getIncidents(): {
        success: boolean;
        summary: {
            total: number;
            open: number;
            acknowledged: number;
            resolved: number;
            critical: number;
            error: number;
            warning: number;
        };
        incidents: import("..").OperationalIncident[];
    };
    getIncident(id: string): {
        success: boolean;
        incident: import("..").OperationalIncident;
    };
    acknowledgeIncident(id: string): {
        success: boolean;
        incident: import("..").OperationalIncident;
    };
    resolveIncident(id: string): {
        success: boolean;
        incident: import("..").OperationalIncident;
    };
    getAlerts(): {
        success: boolean;
        rules: import("..").AlertRule[];
    };
    enableAlert(id: string): {
        success: boolean;
        rule: import("..").AlertRule;
    };
    disableAlert(id: string): {
        success: boolean;
        rule: import("..").AlertRule;
    };
}
