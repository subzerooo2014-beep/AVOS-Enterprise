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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeIncidentService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
let RuntimeIncidentService = class RuntimeIncidentService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    create(dto) {
        this.validateSignalReferences(dto.signalIds ?? []);
        this.validateConfigurationReferences(dto.configurationIds ?? []);
        const now = new Date().toISOString();
        const initialTimeline = {
            id: (0, crypto_1.randomUUID)(),
            status: runtime_resilience_enums_1.RuntimeIncidentStatus.OPEN,
            message: "Runtime incident created",
            actor: dto.actor,
            createdAt: now,
            metadata: {},
        };
        const incident = {
            id: (0, crypto_1.randomUUID)(),
            incidentNumber: this.nextIncidentNumber(),
            title: dto.title,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            severity: dto.severity,
            status: runtime_resilience_enums_1.RuntimeIncidentStatus.OPEN,
            riskLevel: dto.riskLevel,
            signalIds: dto.signalIds ?? [],
            configurationIds: dto.configurationIds ?? [],
            actionIds: [],
            owner: dto.actor,
            tags: dto.tags ?? [],
            timeline: [initialTimeline],
            detectedAt: now,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.saveIncident(incident);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.INCIDENT_CREATED,
            aggregateType: "runtime_incident",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                incidentId: saved.id,
                incidentNumber: saved.incidentNumber,
                title: saved.title,
                environment: saved.environment,
                namespace: saved.namespace,
                service: saved.service ?? null,
                severity: saved.severity,
                status: saved.status,
                riskLevel: saved.riskLevel,
                signalIds: saved.signalIds,
                configurationIds: saved.configurationIds,
            },
        });
        return saved;
    }
    list(filters) {
        return this.store.listIncidents().filter((incident) => {
            if (filters?.status &&
                incident.status !== filters.status) {
                return false;
            }
            if (filters?.environment &&
                incident.environment !== filters.environment) {
                return false;
            }
            if (filters?.namespace &&
                incident.namespace !== filters.namespace) {
                return false;
            }
            if (filters?.service &&
                incident.service !== filters.service) {
                return false;
            }
            return true;
        });
    }
    get(id) {
        const incident = this.store.getIncident(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Runtime incident ${id} was not found`);
        }
        return incident;
    }
    update(id, dto) {
        const incident = this.get(id);
        const now = new Date().toISOString();
        this.validateStatusTransition(incident.status, dto.status);
        incident.status = dto.status;
        incident.updatedAt = now;
        if (dto.status === runtime_resilience_enums_1.RuntimeIncidentStatus.INVESTIGATING &&
            !incident.acknowledgedAt) {
            incident.acknowledgedAt = now;
        }
        if (dto.status === runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED) {
            incident.resolvedAt = now;
        }
        if (dto.status === runtime_resilience_enums_1.RuntimeIncidentStatus.CLOSED) {
            incident.closedAt = now;
        }
        incident.timeline.push({
            id: (0, crypto_1.randomUUID)(),
            status: dto.status,
            message: dto.message,
            actor: dto.actor,
            createdAt: now,
            metadata: (dto.metadata ?? {}),
        });
        const saved = this.store.saveIncident(incident);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.INCIDENT_UPDATED,
            aggregateType: "runtime_incident",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                incidentId: saved.id,
                status: saved.status,
                message: dto.message,
                metadata: (dto.metadata ?? {}),
            },
        });
        return saved;
    }
    attachAction(incidentId, actionId) {
        const incident = this.get(incidentId);
        if (!incident.actionIds.includes(actionId)) {
            incident.actionIds.push(actionId);
            incident.updatedAt = new Date().toISOString();
        }
        return this.store.saveIncident(incident);
    }
    nextIncidentNumber() {
        const next = this.store.listIncidents().length + 1;
        return `AVOS-INC-${String(next).padStart(6, "0")}`;
    }
    validateSignalReferences(signalIds) {
        for (const signalId of signalIds) {
            if (!this.store.getSignal(signalId)) {
                throw new common_1.NotFoundException(`Referenced runtime signal ${signalId} was not found`);
            }
        }
    }
    validateConfigurationReferences(configurationIds) {
        for (const configurationId of configurationIds) {
            if (!this.store.getConfiguration(configurationId)) {
                throw new common_1.NotFoundException(`Referenced resilience configuration ${configurationId} was not found`);
            }
        }
    }
    validateStatusTransition(current, next) {
        if (current === next) {
            return;
        }
        const transitions = {
            [runtime_resilience_enums_1.RuntimeIncidentStatus.OPEN]: [
                runtime_resilience_enums_1.RuntimeIncidentStatus.INVESTIGATING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.MITIGATING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED,
            ],
            [runtime_resilience_enums_1.RuntimeIncidentStatus.INVESTIGATING]: [
                runtime_resilience_enums_1.RuntimeIncidentStatus.MITIGATING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.MONITORING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED,
            ],
            [runtime_resilience_enums_1.RuntimeIncidentStatus.MITIGATING]: [
                runtime_resilience_enums_1.RuntimeIncidentStatus.INVESTIGATING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.MONITORING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED,
            ],
            [runtime_resilience_enums_1.RuntimeIncidentStatus.MONITORING]: [
                runtime_resilience_enums_1.RuntimeIncidentStatus.INVESTIGATING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.MITIGATING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED,
            ],
            [runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED]: [
                runtime_resilience_enums_1.RuntimeIncidentStatus.MONITORING,
                runtime_resilience_enums_1.RuntimeIncidentStatus.CLOSED,
            ],
            [runtime_resilience_enums_1.RuntimeIncidentStatus.CLOSED]: [],
        };
        if (!transitions[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid incident status transition from ${current} to ${next}`);
        }
    }
};
exports.RuntimeIncidentService = RuntimeIncidentService;
exports.RuntimeIncidentService = RuntimeIncidentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], RuntimeIncidentService);
//# sourceMappingURL=runtime-incident.service.js.map