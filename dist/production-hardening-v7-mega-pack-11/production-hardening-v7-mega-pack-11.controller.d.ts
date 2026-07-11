import { AddIncidentTimelineDto } from "./dto/add-incident-timeline.dto";
import { CreateChangeFreezeDto } from "./dto/create-change-freeze.dto";
import { CreateEscalationRuleDto } from "./dto/create-escalation-rule.dto";
import { CreateFreezeExceptionDto } from "./dto/create-freeze-exception.dto";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { RecordOperationalDecisionDto } from "./dto/record-operational-decision.dto";
import { StartCommandCenterDto } from "./dto/start-command-center.dto";
import { ProductionHardeningV7MegaPack11Service } from "./production-hardening-v7-mega-pack-11.service";
export declare class ProductionHardeningV7MegaPack11Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack11Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        commandCenterSessions: number;
        activeCommandCenters: number;
        changeFreezes: number;
        activeChangeFreezes: number;
        freezeExceptions: number;
        approvedFreezeExceptions: number;
        incidents: number;
        openIncidents: number;
        resolvedIncidents: number;
        criticalIncidents: number;
        escalationRules: number;
        activeEscalationRules: number;
        escalations: number;
        completedEscalations: number;
        operationalDecisions: number;
        executiveReports: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-11.types").OperationalSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            commandCenterReady: boolean;
            changeFreezeReady: boolean;
            freezeExceptionReady: boolean;
            incidentManagementReady: boolean;
            escalationFrameworkReady: boolean;
            operationalDecisionsReady: boolean;
            executiveReportingReady: boolean;
            noOpenIncidents: boolean;
            noCriticalIncidents: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-11.types").OperationalSnapshot;
    };
    verifyEvidence(): {
        verified: boolean;
        entries: number;
        brokenAtSequence: number;
        checkedAt: string;
        success: boolean;
    } | {
        verified: boolean;
        entries: number;
        checkedAt: string;
        brokenAtSequence?: undefined;
        success: boolean;
    };
    evidence(): {
        success: boolean;
        entries: import("./production-hardening-v7-mega-pack-11.types").OperationalEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-11.types").OperationalPlatformEvent[];
    };
    startCommandCenter(dto: StartCommandCenterDto): {
        success: boolean;
        commandCenter: import("./production-hardening-v7-mega-pack-11.types").CommandCenterSession;
    };
    listCommandCenters(): {
        success: boolean;
        commandCenters: import("./production-hardening-v7-mega-pack-11.types").CommandCenterSession[];
    };
    endCommandCenter(sessionId: string): {
        success: boolean;
        commandCenter: import("./production-hardening-v7-mega-pack-11.types").CommandCenterSession;
    };
    createChangeFreeze(dto: CreateChangeFreezeDto): {
        success: boolean;
        changeFreeze: import("./production-hardening-v7-mega-pack-11.types").ChangeFreeze;
    };
    listChangeFreezes(): {
        success: boolean;
        changeFreezes: import("./production-hardening-v7-mega-pack-11.types").ChangeFreeze[];
    };
    cancelChangeFreeze(freezeId: string): {
        success: boolean;
        changeFreeze: import("./production-hardening-v7-mega-pack-11.types").ChangeFreeze;
    };
    createFreezeException(freezeId: string, dto: CreateFreezeExceptionDto): {
        success: boolean;
        exception: import("./production-hardening-v7-mega-pack-11.types").ChangeFreezeException;
    };
    approveFreezeException(exceptionId: string): {
        success: boolean;
        exception: import("./production-hardening-v7-mega-pack-11.types").ChangeFreezeException;
    };
    listFreezeExceptions(freezeId?: string): {
        success: boolean;
        exceptions: import("./production-hardening-v7-mega-pack-11.types").ChangeFreezeException[];
    };
    createIncident(dto: CreateIncidentDto): {
        success: boolean;
        incident: import("./production-hardening-v7-mega-pack-11.types").OperationalIncident;
    };
    listIncidents(): {
        success: boolean;
        incidents: import("./production-hardening-v7-mega-pack-11.types").OperationalIncident[];
    };
    getIncident(incidentId: string): {
        success: boolean;
        incident: import("./production-hardening-v7-mega-pack-11.types").OperationalIncident;
    };
    acknowledgeIncident(incidentId: string): {
        success: boolean;
        incident: import("./production-hardening-v7-mega-pack-11.types").OperationalIncident;
    };
    mitigateIncident(incidentId: string): {
        success: boolean;
        incident: import("./production-hardening-v7-mega-pack-11.types").OperationalIncident;
    };
    resolveIncident(incidentId: string): {
        success: boolean;
        incident: import("./production-hardening-v7-mega-pack-11.types").OperationalIncident;
    };
    addIncidentTimeline(incidentId: string, dto: AddIncidentTimelineDto): {
        success: boolean;
        entry: import("./production-hardening-v7-mega-pack-11.types").IncidentTimelineEntry;
    };
    listIncidentTimeline(incidentId: string): {
        success: boolean;
        timeline: import("./production-hardening-v7-mega-pack-11.types").IncidentTimelineEntry[];
    };
    createEscalationRule(dto: CreateEscalationRuleDto): {
        success: boolean;
        rule: import("./production-hardening-v7-mega-pack-11.types").EscalationRule;
    };
    listEscalationRules(): {
        success: boolean;
        rules: import("./production-hardening-v7-mega-pack-11.types").EscalationRule[];
    };
    listEscalations(): {
        success: boolean;
        escalations: import("./production-hardening-v7-mega-pack-11.types").IncidentEscalation[];
    };
    recordDecision(dto: RecordOperationalDecisionDto): {
        success: boolean;
        decision: import("./production-hardening-v7-mega-pack-11.types").OperationalDecisionRecord;
    };
    listDecisions(): {
        success: boolean;
        decisions: import("./production-hardening-v7-mega-pack-11.types").OperationalDecisionRecord[];
    };
    generateExecutiveReport(): {
        success: boolean;
        report: import("./production-hardening-v7-mega-pack-11.types").ExecutiveReadinessReport;
    };
    listExecutiveReports(): {
        success: boolean;
        reports: import("./production-hardening-v7-mega-pack-11.types").ExecutiveReadinessReport[];
    };
}
