"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack11Controller = void 0;
const common_1 = require("@nestjs/common");
const add_incident_timeline_dto_1 = require("./dto/add-incident-timeline.dto");
const create_change_freeze_dto_1 = require("./dto/create-change-freeze.dto");
const create_escalation_rule_dto_1 = require("./dto/create-escalation-rule.dto");
const create_freeze_exception_dto_1 = require("./dto/create-freeze-exception.dto");
const create_incident_dto_1 = require("./dto/create-incident.dto");
const record_operational_decision_dto_1 = require("./dto/record-operational-decision.dto");
const start_command_center_dto_1 = require("./dto/start-command-center.dto");
const production_hardening_v7_mega_pack_11_service_1 = require("./production-hardening-v7-mega-pack-11.service");
let ProductionHardeningV7MegaPack11Controller = class ProductionHardeningV7MegaPack11Controller {
    constructor(service) {
        this.service = service;
    }
    status() {
        return this.service.getStatus();
    }
    snapshot() {
        return {
            success: true,
            snapshot: this.service.getSnapshot(),
        };
    }
    verify() {
        return this.service.runVerification();
    }
    verifyEvidence() {
        return {
            success: true,
            ...this.service.verifyEvidenceChain(),
        };
    }
    evidence() {
        return {
            success: true,
            entries: this.service.listEvidenceEntries(),
        };
    }
    events() {
        return {
            success: true,
            events: this.service.listPlatformEvents(),
        };
    }
    startCommandCenter(dto) {
        return {
            success: true,
            commandCenter: this.service.startCommandCenter(dto, "api"),
        };
    }
    listCommandCenters() {
        return {
            success: true,
            commandCenters: this.service.listCommandCenters(),
        };
    }
    endCommandCenter(sessionId) {
        return {
            success: true,
            commandCenter: this.service.endCommandCenter(sessionId, "api"),
        };
    }
    createChangeFreeze(dto) {
        return {
            success: true,
            changeFreeze: this.service.createChangeFreeze(dto, "api"),
        };
    }
    listChangeFreezes() {
        return {
            success: true,
            changeFreezes: this.service.listChangeFreezes(),
        };
    }
    cancelChangeFreeze(freezeId) {
        return {
            success: true,
            changeFreeze: this.service.cancelChangeFreeze(freezeId, "api"),
        };
    }
    createFreezeException(freezeId, dto) {
        return {
            success: true,
            exception: this.service.createFreezeException(freezeId, dto, "api"),
        };
    }
    approveFreezeException(exceptionId) {
        return {
            success: true,
            exception: this.service.approveFreezeException(exceptionId, "api"),
        };
    }
    listFreezeExceptions(freezeId) {
        return {
            success: true,
            exceptions: this.service.listFreezeExceptions(freezeId),
        };
    }
    createIncident(dto) {
        return {
            success: true,
            incident: this.service.createIncident(dto, "api"),
        };
    }
    listIncidents() {
        return {
            success: true,
            incidents: this.service.listIncidents(),
        };
    }
    getIncident(incidentId) {
        return {
            success: true,
            incident: this.service.getIncident(incidentId),
        };
    }
    acknowledgeIncident(incidentId) {
        return {
            success: true,
            incident: this.service.acknowledgeIncident(incidentId, "api"),
        };
    }
    mitigateIncident(incidentId) {
        return {
            success: true,
            incident: this.service.mitigateIncident(incidentId, "api"),
        };
    }
    resolveIncident(incidentId) {
        return {
            success: true,
            incident: this.service.resolveIncident(incidentId, "api"),
        };
    }
    addIncidentTimeline(incidentId, dto) {
        return {
            success: true,
            entry: this.service.addIncidentTimeline(incidentId, dto, "api"),
        };
    }
    listIncidentTimeline(incidentId) {
        return {
            success: true,
            timeline: this.service.listIncidentTimeline(incidentId),
        };
    }
    createEscalationRule(dto) {
        return {
            success: true,
            rule: this.service.createEscalationRule(dto, "api"),
        };
    }
    listEscalationRules() {
        return {
            success: true,
            rules: this.service.listEscalationRules(),
        };
    }
    listEscalations() {
        return {
            success: true,
            escalations: this.service.listEscalations(),
        };
    }
    recordDecision(dto) {
        return {
            success: true,
            decision: this.service.recordDecision(dto, "api"),
        };
    }
    listDecisions() {
        return {
            success: true,
            decisions: this.service.listDecisions(),
        };
    }
    generateExecutiveReport() {
        return {
            success: true,
            report: this.service.generateExecutiveReport("api"),
        };
    }
    listExecutiveReports() {
        return {
            success: true,
            reports: this.service.listExecutiveReports(),
        };
    }
};
exports.ProductionHardeningV7MegaPack11Controller = ProductionHardeningV7MegaPack11Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("command-centers"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_command_center_dto_1.StartCommandCenterDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "startCommandCenter", null);
__decorate([
    (0, common_1.Get)("command-centers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listCommandCenters", null);
__decorate([
    (0, common_1.Post)("command-centers/:sessionId/end"),
    __param(0, (0, common_1.Param)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "endCommandCenter", null);
__decorate([
    (0, common_1.Post)("change-freezes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_change_freeze_dto_1.CreateChangeFreezeDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "createChangeFreeze", null);
__decorate([
    (0, common_1.Get)("change-freezes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listChangeFreezes", null);
__decorate([
    (0, common_1.Post)("change-freezes/:freezeId/cancel"),
    __param(0, (0, common_1.Param)("freezeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "cancelChangeFreeze", null);
__decorate([
    (0, common_1.Post)("change-freezes/:freezeId/exceptions"),
    __param(0, (0, common_1.Param)("freezeId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_freeze_exception_dto_1.CreateFreezeExceptionDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "createFreezeException", null);
__decorate([
    (0, common_1.Post)("freeze-exceptions/:exceptionId/approve"),
    __param(0, (0, common_1.Param)("exceptionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "approveFreezeException", null);
__decorate([
    (0, common_1.Get)("freeze-exceptions"),
    __param(0, (0, common_1.Query)("freezeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listFreezeExceptions", null);
__decorate([
    (0, common_1.Post)("incidents"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incident_dto_1.CreateIncidentDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "createIncident", null);
__decorate([
    (0, common_1.Get)("incidents"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listIncidents", null);
__decorate([
    (0, common_1.Get)("incidents/:incidentId"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "getIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/acknowledge"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "acknowledgeIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/mitigate"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "mitigateIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/resolve"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "resolveIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/timeline"),
    __param(0, (0, common_1.Param)("incidentId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_incident_timeline_dto_1.AddIncidentTimelineDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "addIncidentTimeline", null);
__decorate([
    (0, common_1.Get)("incidents/:incidentId/timeline"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listIncidentTimeline", null);
__decorate([
    (0, common_1.Post)("escalation-rules"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_escalation_rule_dto_1.CreateEscalationRuleDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "createEscalationRule", null);
__decorate([
    (0, common_1.Get)("escalation-rules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listEscalationRules", null);
__decorate([
    (0, common_1.Get)("escalations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listEscalations", null);
__decorate([
    (0, common_1.Post)("decisions"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_operational_decision_dto_1.RecordOperationalDecisionDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "recordDecision", null);
__decorate([
    (0, common_1.Get)("decisions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listDecisions", null);
__decorate([
    (0, common_1.Post)("executive-reports/generate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "generateExecutiveReport", null);
__decorate([
    (0, common_1.Get)("executive-reports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack11Controller.prototype, "listExecutiveReports", null);
exports.ProductionHardeningV7MegaPack11Controller = ProductionHardeningV7MegaPack11Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-11"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_11_service_1.ProductionHardeningV7MegaPack11Service])
], ProductionHardeningV7MegaPack11Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-11.controller.js.map