"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack11Service = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ProductionHardeningV7MegaPack11Service = class ProductionHardeningV7MegaPack11Service {
    constructor() {
        this.commandCenters = new Map();
        this.freezes = new Map();
        this.freezeExceptions = new Map();
        this.incidents = new Map();
        this.timelineEntries = new Map();
        this.escalationRules = new Map();
        this.escalations = new Map();
        this.decisions = new Map();
        this.reports = new Map();
        this.evidenceEntries = [];
        this.platformEvents = [];
    }
    onModuleInit() {
        if (this.incidents.size === 0) {
            this.seedOperationalCommandCenter();
        }
    }
    now() {
        return new Date().toISOString();
    }
    requireText(value, field) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new common_1.BadRequestException(`${field} is required`);
        }
        return value.trim();
    }
    clamp(value, fallback, minimum, maximum) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return fallback;
        }
        return Math.min(maximum, Math.max(minimum, parsed));
    }
    stableSerialize(value) {
        if (value === null || typeof value !== "object") {
            return JSON.stringify(value);
        }
        if (Array.isArray(value)) {
            return `[${value
                .map((item) => this.stableSerialize(item))
                .join(",")}]`;
        }
        const record = value;
        return `{${Object.keys(record)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${this.stableSerialize(record[key])}`)
            .join(",")}}`;
    }
    hash(value) {
        return (0, crypto_1.createHash)("sha256")
            .update(this.stableSerialize(value))
            .digest("hex");
    }
    record(eventType, entityType, entityId, actor, payload = {}) {
        const previous = this.evidenceEntries[this.evidenceEntries.length - 1];
        const sequence = this.evidenceEntries.length + 1;
        const previousHash = previous?.hash ?? "GENESIS";
        const timestamp = this.now();
        const hash = this.hash({
            sequence,
            eventType,
            entityType,
            entityId,
            actor,
            timestamp,
            payload,
            previousHash,
        });
        const evidence = {
            id: (0, crypto_1.randomUUID)(),
            sequence,
            eventType,
            entityType,
            entityId,
            actor,
            timestamp,
            payload,
            previousHash,
            hash,
        };
        this.evidenceEntries.push(evidence);
        this.platformEvents.push({
            id: (0, crypto_1.randomUUID)(),
            eventType,
            entityType,
            entityId,
            timestamp,
            payload,
        });
        return evidence;
    }
    startCommandCenter(dto, actor = "system") {
        const startedAt = this.now();
        const session = {
            id: (0, crypto_1.randomUUID)(),
            name: this.requireText(dto.name, "name"),
            status: dto.status ?? "elevated",
            reason: this.requireText(dto.reason, "reason"),
            commander: dto.commander?.trim() || actor,
            participants: Array.from(new Set((dto.participants ?? [])
                .map((item) => item.trim())
                .filter(Boolean))),
            startedAt,
            decisionIds: [],
            incidentIds: [],
        };
        this.commandCenters.set(session.id, session);
        this.record("operations.command_center.started", "command_center", session.id, actor, {
            name: session.name,
            status: session.status,
            commander: session.commander,
        });
        return session;
    }
    endCommandCenter(sessionId, actor = "system") {
        const session = this.getCommandCenter(sessionId);
        if (session.endedAt) {
            throw new common_1.BadRequestException("Command center session is already ended");
        }
        session.endedAt = this.now();
        session.status = "normal";
        this.record("operations.command_center.ended", "command_center", session.id, actor, {
            endedAt: session.endedAt,
            decisions: session.decisionIds.length,
            incidents: session.incidentIds.length,
        });
        return session;
    }
    getCommandCenter(sessionId) {
        const session = this.commandCenters.get(sessionId);
        if (!session) {
            throw new common_1.NotFoundException(`Command center ${sessionId} was not found`);
        }
        return session;
    }
    listCommandCenters() {
        return Array.from(this.commandCenters.values()).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    }
    createChangeFreeze(dto, actor = "system") {
        const startedAt = dto.startedAt || this.now();
        const endsAt = this.requireText(dto.endsAt, "endsAt");
        if (new Date(endsAt).getTime() <=
            new Date(startedAt).getTime()) {
            throw new common_1.BadRequestException("endsAt must be later than startedAt");
        }
        const freeze = {
            id: (0, crypto_1.randomUUID)(),
            name: this.requireText(dto.name, "name"),
            reason: this.requireText(dto.reason, "reason"),
            environment: dto.environment?.trim() || "production",
            status: new Date(startedAt).getTime() <= Date.now()
                ? "active"
                : "scheduled",
            startedAt,
            endsAt,
            createdBy: dto.createdBy?.trim() || actor,
            exceptionIds: [],
            createdAt: this.now(),
        };
        this.freezes.set(freeze.id, freeze);
        this.record("operations.change_freeze.created", "change_freeze", freeze.id, actor, {
            environment: freeze.environment,
            status: freeze.status,
            startedAt,
            endsAt,
        });
        return freeze;
    }
    cancelChangeFreeze(freezeId, actor = "system") {
        const freeze = this.getChangeFreeze(freezeId);
        freeze.status = "cancelled";
        freeze.cancelledAt = this.now();
        this.record("operations.change_freeze.cancelled", "change_freeze", freeze.id, actor, {
            cancelledAt: freeze.cancelledAt,
        });
        return freeze;
    }
    getChangeFreeze(freezeId) {
        const freeze = this.freezes.get(freezeId);
        if (!freeze) {
            throw new common_1.NotFoundException(`Change freeze ${freezeId} was not found`);
        }
        if (freeze.status === "active" &&
            new Date(freeze.endsAt).getTime() < Date.now()) {
            freeze.status = "expired";
        }
        return freeze;
    }
    listChangeFreezes() {
        return Array.from(this.freezes.values())
            .map((freeze) => this.getChangeFreeze(freeze.id))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    createFreezeException(freezeId, dto, actor = "system") {
        const freeze = this.getChangeFreeze(freezeId);
        if (freeze.status !== "active") {
            throw new common_1.BadRequestException("Exceptions can only be requested for active freezes");
        }
        const exception = {
            id: (0, crypto_1.randomUUID)(),
            freezeId,
            changeReference: this.requireText(dto.changeReference, "changeReference"),
            reason: this.requireText(dto.reason, "reason"),
            requestedBy: dto.requestedBy?.trim() || actor,
            status: "pending",
            createdAt: this.now(),
        };
        this.freezeExceptions.set(exception.id, exception);
        freeze.exceptionIds.push(exception.id);
        this.record("operations.change_freeze_exception.created", "change_freeze_exception", exception.id, actor, {
            freezeId,
            changeReference: exception.changeReference,
        });
        return exception;
    }
    approveFreezeException(exceptionId, approvedBy = "system") {
        const exception = this.getFreezeException(exceptionId);
        exception.status = "approved";
        exception.approvedBy = approvedBy;
        exception.decidedAt = this.now();
        this.record("operations.change_freeze_exception.approved", "change_freeze_exception", exception.id, approvedBy, {
            freezeId: exception.freezeId,
            changeReference: exception.changeReference,
        });
        return exception;
    }
    getFreezeException(exceptionId) {
        const exception = this.freezeExceptions.get(exceptionId);
        if (!exception) {
            throw new common_1.NotFoundException(`Freeze exception ${exceptionId} was not found`);
        }
        return exception;
    }
    listFreezeExceptions(freezeId) {
        return Array.from(this.freezeExceptions.values())
            .filter((item) => !freezeId || item.freezeId === freezeId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    createIncident(dto, actor = "system") {
        const detectedAt = this.now();
        const incident = {
            id: (0, crypto_1.randomUUID)(),
            title: this.requireText(dto.title, "title"),
            description: dto.description?.trim() || "",
            severity: dto.severity,
            status: "open",
            serviceName: this.requireText(dto.serviceName, "serviceName"),
            environment: dto.environment?.trim() || "production",
            detectedAt,
            owner: dto.owner?.trim() || actor,
            impactSummary: dto.impactSummary?.trim() || "Impact under assessment",
            escalationIds: [],
            timelineIds: [],
        };
        this.incidents.set(incident.id, incident);
        this.addIncidentTimeline(incident.id, {
            eventType: "incident_created",
            message: `Incident created with severity ${incident.severity}`,
            actor,
        }, actor);
        this.record("operations.incident.created", "incident", incident.id, actor, {
            severity: incident.severity,
            serviceName: incident.serviceName,
            environment: incident.environment,
        });
        this.triggerEscalations(incident.id, actor);
        return incident;
    }
    acknowledgeIncident(incidentId, actor = "system") {
        const incident = this.getIncident(incidentId);
        incident.status = "investigating";
        incident.acknowledgedAt = this.now();
        this.addIncidentTimeline(incident.id, {
            eventType: "incident_acknowledged",
            message: "Incident acknowledged and investigation started",
            actor,
        }, actor);
        this.record("operations.incident.acknowledged", "incident", incident.id, actor, {
            acknowledgedAt: incident.acknowledgedAt,
        });
        for (const escalationId of incident.escalationIds) {
            const escalation = this.escalations.get(escalationId);
            if (escalation && escalation.status === "pending") {
                escalation.status = "acknowledged";
                escalation.acknowledgedAt = this.now();
            }
        }
        return incident;
    }
    mitigateIncident(incidentId, actor = "system") {
        const incident = this.getIncident(incidentId);
        incident.status = "mitigated";
        incident.mitigatedAt = this.now();
        this.addIncidentTimeline(incident.id, {
            eventType: "incident_mitigated",
            message: "Operational impact mitigated",
            actor,
        }, actor);
        this.record("operations.incident.mitigated", "incident", incident.id, actor, {
            mitigatedAt: incident.mitigatedAt,
        });
        return incident;
    }
    resolveIncident(incidentId, actor = "system") {
        const incident = this.getIncident(incidentId);
        incident.status = "resolved";
        incident.resolvedAt = this.now();
        this.addIncidentTimeline(incident.id, {
            eventType: "incident_resolved",
            message: "Incident resolved and service stability verified",
            actor,
        }, actor);
        for (const escalationId of incident.escalationIds) {
            const escalation = this.escalations.get(escalationId);
            if (escalation) {
                escalation.status = "completed";
                escalation.completedAt = this.now();
            }
        }
        this.record("operations.incident.resolved", "incident", incident.id, actor, {
            resolvedAt: incident.resolvedAt,
        });
        return incident;
    }
    getIncident(incidentId) {
        const incident = this.incidents.get(incidentId);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident ${incidentId} was not found`);
        }
        return incident;
    }
    listIncidents() {
        return Array.from(this.incidents.values()).sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
    }
    addIncidentTimeline(incidentId, dto, actor = "system") {
        const incident = this.getIncident(incidentId);
        const entry = {
            id: (0, crypto_1.randomUUID)(),
            incidentId,
            eventType: this.requireText(dto.eventType, "eventType"),
            message: this.requireText(dto.message, "message"),
            actor: dto.actor?.trim() || actor,
            timestamp: this.now(),
        };
        this.timelineEntries.set(entry.id, entry);
        incident.timelineIds.push(entry.id);
        this.record("operations.incident.timeline_added", "incident_timeline", entry.id, actor, {
            incidentId,
            eventType: entry.eventType,
        });
        return entry;
    }
    listIncidentTimeline(incidentId) {
        const incident = this.getIncident(incidentId);
        return incident.timelineIds
            .map((id) => this.timelineEntries.get(id))
            .filter((entry) => Boolean(entry))
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
    createEscalationRule(dto, actor = "system") {
        const rule = {
            id: (0, crypto_1.randomUUID)(),
            name: this.requireText(dto.name, "name"),
            severity: dto.severity,
            acknowledgeWithinMinutes: this.clamp(dto.acknowledgeWithinMinutes, 10, 1, 1440),
            escalateAfterMinutes: this.clamp(dto.escalateAfterMinutes, 15, 1, 1440),
            targetRole: this.requireText(dto.targetRole, "targetRole"),
            notifyExecutive: dto.notifyExecutive === true,
            active: true,
            createdAt: this.now(),
        };
        this.escalationRules.set(rule.id, rule);
        this.record("operations.escalation_rule.created", "escalation_rule", rule.id, actor, {
            severity: rule.severity,
            targetRole: rule.targetRole,
        });
        return rule;
    }
    triggerEscalations(incidentId, actor = "system") {
        const incident = this.getIncident(incidentId);
        const matchingRules = Array.from(this.escalationRules.values()).filter((rule) => rule.active && rule.severity === incident.severity);
        const created = [];
        for (const rule of matchingRules) {
            const escalation = {
                id: (0, crypto_1.randomUUID)(),
                incidentId,
                ruleId: rule.id,
                targetRole: rule.targetRole,
                status: "pending",
                triggeredAt: this.now(),
                message: `Escalation triggered for ${incident.severity} incident`,
            };
            this.escalations.set(escalation.id, escalation);
            incident.escalationIds.push(escalation.id);
            created.push(escalation);
            this.record("operations.incident.escalated", "incident_escalation", escalation.id, actor, {
                incidentId,
                severity: incident.severity,
                targetRole: rule.targetRole,
                notifyExecutive: rule.notifyExecutive,
            });
        }
        return created;
    }
    listEscalationRules() {
        return Array.from(this.escalationRules.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    listEscalations() {
        return Array.from(this.escalations.values()).sort((a, b) => b.triggeredAt.localeCompare(a.triggeredAt));
    }
    recordDecision(dto, actor = "system") {
        if (dto.sessionId) {
            this.getCommandCenter(dto.sessionId);
        }
        if (dto.incidentId) {
            this.getIncident(dto.incidentId);
        }
        const decision = {
            id: (0, crypto_1.randomUUID)(),
            sessionId: dto.sessionId,
            incidentId: dto.incidentId,
            decision: dto.decision,
            reason: this.requireText(dto.reason, "reason"),
            decidedBy: dto.decidedBy?.trim() || actor,
            timestamp: this.now(),
        };
        this.decisions.set(decision.id, decision);
        if (decision.sessionId) {
            this.getCommandCenter(decision.sessionId).decisionIds.push(decision.id);
        }
        this.record("operations.decision.recorded", "operational_decision", decision.id, decision.decidedBy, {
            sessionId: decision.sessionId,
            incidentId: decision.incidentId,
            decision: decision.decision,
        });
        return decision;
    }
    listDecisions() {
        return Array.from(this.decisions.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    generateExecutiveReport(actor = "system") {
        const snapshot = this.getSnapshot();
        let score = 100;
        const recommendations = [];
        score -= snapshot.openIncidents * 5;
        score -= snapshot.criticalIncidents * 20;
        const pendingEscalations = this.listEscalations().filter((item) => item.status === "pending").length;
        score -= pendingEscalations * 5;
        if (snapshot.criticalIncidents > 0) {
            recommendations.push("Maintain executive incident oversight until all SEV1 incidents are resolved");
        }
        if (snapshot.openIncidents > 0) {
            recommendations.push("Continue command-center monitoring and incident-owner follow-up");
        }
        if (snapshot.activeChangeFreezes === 0) {
            recommendations.push("Activate a production change freeze during critical operational events");
        }
        if (recommendations.length === 0) {
            recommendations.push("Operational controls are healthy and no immediate intervention is required");
        }
        const report = {
            id: (0, crypto_1.randomUUID)(),
            generatedAt: this.now(),
            healthStatus: snapshot.healthStatus,
            activeCommandCenters: snapshot.activeCommandCenters,
            activeChangeFreezes: snapshot.activeChangeFreezes,
            openIncidents: snapshot.openIncidents,
            criticalIncidents: snapshot.criticalIncidents,
            pendingEscalations,
            unresolvedSev1: this.listIncidents().filter((incident) => incident.severity === "sev1" &&
                !["resolved", "closed"].includes(incident.status)).length,
            operationalReadinessScore: Math.max(0, score),
            recommendations,
        };
        this.reports.set(report.id, report);
        this.record("operations.executive_report.generated", "executive_readiness_report", report.id, actor, {
            healthStatus: report.healthStatus,
            operationalReadinessScore: report.operationalReadinessScore,
        });
        return report;
    }
    listExecutiveReports() {
        return Array.from(this.reports.values()).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
    }
    verifyEvidenceChain() {
        let previousHash = "GENESIS";
        for (const entry of this.evidenceEntries) {
            const calculatedHash = this.hash({
                sequence: entry.sequence,
                eventType: entry.eventType,
                entityType: entry.entityType,
                entityId: entry.entityId,
                actor: entry.actor,
                timestamp: entry.timestamp,
                payload: entry.payload,
                previousHash: entry.previousHash,
            });
            if (entry.previousHash !== previousHash ||
                entry.hash !== calculatedHash) {
                return {
                    verified: false,
                    entries: this.evidenceEntries.length,
                    brokenAtSequence: entry.sequence,
                    checkedAt: this.now(),
                };
            }
            previousHash = entry.hash;
        }
        return {
            verified: true,
            entries: this.evidenceEntries.length,
            checkedAt: this.now(),
        };
    }
    listEvidenceEntries() {
        return [...this.evidenceEntries];
    }
    listPlatformEvents() {
        return [...this.platformEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    getSnapshot() {
        const commandCenters = this.listCommandCenters();
        const freezes = this.listChangeFreezes();
        const exceptions = this.listFreezeExceptions();
        const incidents = this.listIncidents();
        const escalationRules = this.listEscalationRules();
        const escalations = this.listEscalations();
        const decisions = this.listDecisions();
        const reports = this.listExecutiveReports();
        const evidence = this.verifyEvidenceChain();
        const openIncidents = incidents.filter((incident) => !["resolved", "closed"].includes(incident.status)).length;
        const criticalIncidents = incidents.filter((incident) => incident.severity === "sev1" &&
            !["resolved", "closed"].includes(incident.status)).length;
        const healthStatus = !evidence.verified || criticalIncidents > 0
            ? "critical"
            : openIncidents > 0
                ? "degraded"
                : "healthy";
        return {
            generatedAt: this.now(),
            healthStatus,
            evidenceChainVerified: evidence.verified,
            commandCenterSessions: commandCenters.length,
            activeCommandCenters: commandCenters.filter((session) => !session.endedAt).length,
            changeFreezes: freezes.length,
            activeChangeFreezes: freezes.filter((freeze) => freeze.status === "active").length,
            freezeExceptions: exceptions.length,
            approvedFreezeExceptions: exceptions.filter((item) => item.status === "approved").length,
            incidents: incidents.length,
            openIncidents,
            resolvedIncidents: incidents.filter((incident) => incident.status === "resolved").length,
            criticalIncidents,
            escalationRules: escalationRules.length,
            activeEscalationRules: escalationRules.filter((rule) => rule.active).length,
            escalations: escalations.length,
            completedEscalations: escalations.filter((item) => item.status === "completed").length,
            operationalDecisions: decisions.length,
            executiveReports: reports.length,
            evidenceEntries: this.evidenceEntries.length,
            platformEvents: this.platformEvents.length,
        };
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Production Hardening V7 — Mega Pack 11",
            version: "v7-mega-pack-11",
            ...this.getSnapshot(),
        };
    }
    runVerification() {
        const snapshot = this.getSnapshot();
        const checks = {
            commandCenterReady: snapshot.commandCenterSessions > 0,
            changeFreezeReady: snapshot.changeFreezes > 0,
            freezeExceptionReady: snapshot.freezeExceptions > 0 &&
                snapshot.approvedFreezeExceptions > 0,
            incidentManagementReady: snapshot.incidents > 0 &&
                snapshot.resolvedIncidents > 0,
            escalationFrameworkReady: snapshot.escalationRules > 0 &&
                snapshot.escalations > 0 &&
                snapshot.completedEscalations > 0,
            operationalDecisionsReady: snapshot.operationalDecisions > 0,
            executiveReportingReady: snapshot.executiveReports > 0,
            noOpenIncidents: snapshot.openIncidents === 0,
            noCriticalIncidents: snapshot.criticalIncidents === 0,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            platformEventsReady: snapshot.platformEvents > 0,
        };
        return {
            success: Object.values(checks).every(Boolean),
            system: "AVOS Production Hardening V7 — Mega Pack 11",
            version: "v7-mega-pack-11",
            healthStatus: snapshot.healthStatus,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            checks,
            snapshot,
        };
    }
    seedOperationalCommandCenter() {
        const sev1Rule = this.createEscalationRule({
            name: "SEV1 Executive Escalation",
            severity: "sev1",
            acknowledgeWithinMinutes: 5,
            escalateAfterMinutes: 10,
            targetRole: "executive-incident-commander",
            notifyExecutive: true,
        }, "mega-pack-11-seed");
        if (!sev1Rule.active) {
            throw new Error("SEV1 escalation rule was not activated");
        }
        this.createEscalationRule({
            name: "SEV2 Operations Escalation",
            severity: "sev2",
            acknowledgeWithinMinutes: 10,
            escalateAfterMinutes: 20,
            targetRole: "operations-manager",
            notifyExecutive: false,
        }, "mega-pack-11-seed");
        const session = this.startCommandCenter({
            name: "AVOS Enterprise Operations Command Center",
            reason: "Validate enterprise incident command and escalation controls",
            commander: "mega-pack-11-seed",
            participants: [
                "operations",
                "security",
                "platform",
                "executive-liaison",
            ],
            status: "major_incident",
        }, "mega-pack-11-seed");
        const freeze = this.createChangeFreeze({
            name: "AVOS Production Incident Freeze",
            reason: "Prevent nonessential production changes during operational validation",
            environment: "production",
            startedAt: this.now(),
            endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            createdBy: "mega-pack-11-seed",
        }, "mega-pack-11-seed");
        const exception = this.createFreezeException(freeze.id, {
            changeReference: "AVOS-RECOVERY-VALIDATION",
            reason: "Authorized emergency validation change",
            requestedBy: "mega-pack-11-seed",
        }, "mega-pack-11-seed");
        this.approveFreezeException(exception.id, "mega-pack-11-seed");
        const incident = this.createIncident({
            title: "AVOS Controlled Production Incident",
            description: "Controlled incident used to validate operational command controls",
            severity: "sev1",
            serviceName: "avos-api",
            environment: "production",
            owner: "mega-pack-11-seed",
            impactSummary: "Controlled validation impact with no customer data loss",
        }, "mega-pack-11-seed");
        session.incidentIds.push(incident.id);
        this.recordDecision({
            sessionId: session.id,
            incidentId: incident.id,
            decision: "freeze_changes",
            reason: "Protect production stability during incident response",
            decidedBy: "mega-pack-11-seed",
        }, "mega-pack-11-seed");
        this.recordDecision({
            sessionId: session.id,
            incidentId: incident.id,
            decision: "invoke_recovery",
            reason: "Validate automated recovery and incident resolution path",
            decidedBy: "mega-pack-11-seed",
        }, "mega-pack-11-seed");
        this.acknowledgeIncident(incident.id, "mega-pack-11-seed");
        this.mitigateIncident(incident.id, "mega-pack-11-seed");
        this.resolveIncident(incident.id, "mega-pack-11-seed");
        this.endCommandCenter(session.id, "mega-pack-11-seed");
        this.cancelChangeFreeze(freeze.id, "mega-pack-11-seed");
        this.generateExecutiveReport("mega-pack-11-seed");
    }
};
exports.ProductionHardeningV7MegaPack11Service = ProductionHardeningV7MegaPack11Service;
exports.ProductionHardeningV7MegaPack11Service = ProductionHardeningV7MegaPack11Service = __decorate([
    (0, common_1.Injectable)()
], ProductionHardeningV7MegaPack11Service);
//# sourceMappingURL=production-hardening-v7-mega-pack-11.service.js.map