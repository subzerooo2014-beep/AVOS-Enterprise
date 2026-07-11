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
exports.ProductionHardeningV8MegaPack2Controller = void 0;
const common_1 = require("@nestjs/common");
const create_dependency_dto_1 = require("./dto/create-dependency.dto");
const create_incident_dto_1 = require("./dto/create-incident.dto");
const create_managed_service_dto_1 = require("./dto/create-managed-service.dto");
const create_recovery_plan_dto_1 = require("./dto/create-recovery-plan.dto");
const update_service_metrics_dto_1 = require("./dto/update-service-metrics.dto");
const production_hardening_v8_mega_pack_2_service_1 = require("./production-hardening-v8-mega-pack-2.service");
let ProductionHardeningV8MegaPack2Controller = class ProductionHardeningV8MegaPack2Controller {
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
    createService(dto) {
        return {
            success: true,
            service: this.service.createService(dto, "api"),
        };
    }
    listServices() {
        return {
            success: true,
            services: this.service.listServices(),
        };
    }
    getService(serviceId) {
        return {
            success: true,
            service: this.service.getService(serviceId),
        };
    }
    updateMetrics(serviceId, dto) {
        return {
            success: true,
            service: this.service.updateServiceMetrics(serviceId, dto, "api"),
        };
    }
    createDependency(serviceId, dto) {
        return {
            success: true,
            dependency: this.service.createDependency(serviceId, dto, "api"),
        };
    }
    listDependencies(serviceId) {
        return {
            success: true,
            dependencies: this.service.listDependencies(serviceId),
        };
    }
    dependencyGraph() {
        return {
            success: true,
            edges: this.service.listDependencyGraphEdges(),
        };
    }
    createRecoveryPlan(serviceId, dto) {
        return {
            success: true,
            plan: this.service.createRecoveryPlan(serviceId, dto, "api"),
        };
    }
    listRecoveryPlans() {
        return {
            success: true,
            plans: this.service.listRecoveryPlans(),
        };
    }
    createIncident(serviceId, dto) {
        return {
            success: true,
            incident: this.service.createIncident(serviceId, dto, "api"),
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
    analyzeIncident(incidentId) {
        return {
            success: true,
            analysis: this.service.generateRootCauseAnalysis(incidentId, "api"),
        };
    }
    listRootCauseAnalyses() {
        return {
            success: true,
            analyses: this.service.listRootCauseAnalyses(),
        };
    }
    executeRecoveryPlan(incidentId, recoveryPlanId) {
        return {
            success: true,
            executions: this.service.executeRecoveryPlan(incidentId, recoveryPlanId, "api"),
        };
    }
    listRecoveryExecutions() {
        return {
            success: true,
            executions: this.service.listRecoveryExecutions(),
        };
    }
    listDecisions() {
        return {
            success: true,
            decisions: this.service.listDecisions(),
        };
    }
};
exports.ProductionHardeningV8MegaPack2Controller = ProductionHardeningV8MegaPack2Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("services"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_managed_service_dto_1.CreateManagedServiceDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "createService", null);
__decorate([
    (0, common_1.Get)("services"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listServices", null);
__decorate([
    (0, common_1.Get)("services/:serviceId"),
    __param(0, (0, common_1.Param)("serviceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "getService", null);
__decorate([
    (0, common_1.Post)("services/:serviceId/metrics"),
    __param(0, (0, common_1.Param)("serviceId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_metrics_dto_1.UpdateServiceMetricsDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "updateMetrics", null);
__decorate([
    (0, common_1.Post)("services/:serviceId/dependencies"),
    __param(0, (0, common_1.Param)("serviceId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_dependency_dto_1.CreateDependencyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "createDependency", null);
__decorate([
    (0, common_1.Get)("dependencies"),
    __param(0, (0, common_1.Query)("serviceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listDependencies", null);
__decorate([
    (0, common_1.Get)("dependency-graph"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "dependencyGraph", null);
__decorate([
    (0, common_1.Post)("services/:serviceId/recovery-plans"),
    __param(0, (0, common_1.Param)("serviceId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_recovery_plan_dto_1.CreateRecoveryPlanDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "createRecoveryPlan", null);
__decorate([
    (0, common_1.Get)("recovery-plans"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listRecoveryPlans", null);
__decorate([
    (0, common_1.Post)("services/:serviceId/incidents"),
    __param(0, (0, common_1.Param)("serviceId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_incident_dto_1.CreateIncidentDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "createIncident", null);
__decorate([
    (0, common_1.Get)("incidents"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listIncidents", null);
__decorate([
    (0, common_1.Get)("incidents/:incidentId"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "getIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/analyze"),
    __param(0, (0, common_1.Param)("incidentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "analyzeIncident", null);
__decorate([
    (0, common_1.Get)("root-cause-analyses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listRootCauseAnalyses", null);
__decorate([
    (0, common_1.Post)("incidents/:incidentId/recovery-plans/:recoveryPlanId/execute"),
    __param(0, (0, common_1.Param)("incidentId")),
    __param(1, (0, common_1.Param)("recoveryPlanId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "executeRecoveryPlan", null);
__decorate([
    (0, common_1.Get)("recovery-executions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listRecoveryExecutions", null);
__decorate([
    (0, common_1.Get)("operations-decisions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack2Controller.prototype, "listDecisions", null);
exports.ProductionHardeningV8MegaPack2Controller = ProductionHardeningV8MegaPack2Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-2"),
    __metadata("design:paramtypes", [production_hardening_v8_mega_pack_2_service_1.ProductionHardeningV8MegaPack2Service])
], ProductionHardeningV8MegaPack2Controller);
//# sourceMappingURL=production-hardening-v8-mega-pack-2.controller.js.map