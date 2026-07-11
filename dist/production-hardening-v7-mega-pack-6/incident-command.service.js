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
exports.IncidentCommandService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
let IncidentCommandService = class IncidentCommandService {
    constructor(storage, sequence, events) {
        this.storage = storage;
        this.sequence = sequence;
        this.events = events;
    }
    async create(dto) {
        const now = new Date().toISOString();
        const incident = {
            id: (0, node_crypto_1.randomUUID)(),
            incidentCode: this.sequence.next(mega_pack_6_constants_1.INCIDENT_CODE_PREFIX),
            title: dto.title,
            description: dto.description,
            severity: dto.severity,
            status: "detected",
            source: dto.source,
            detectedAt: dto.detectedAt ?? now,
            commander: dto.commander,
            commandTeam: dto.commander
                ? [
                    {
                        id: (0, node_crypto_1.randomUUID)(),
                        person: dto.commander,
                        role: "incident_commander",
                        assignedAt: now,
                        active: true,
                    },
                ]
                : [],
            affectedServices: dto.affectedServices ?? [],
            businessImpact: dto.businessImpact,
            technicalImpact: dto.technicalImpact,
            regulatoryImpact: dto.regulatoryImpact,
            evidenceReferences: dto.evidenceReferences ?? [],
            timeline: [
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    timestamp: now,
                    eventType: "incident_detected",
                    description: "Enterprise incident record created",
                    actor: dto.source,
                    metadata: {},
                },
            ],
            actions: [],
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        await this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, incident);
        await this.events.publish({
            eventType: "incident.detected",
            source: "IncidentCommandService",
            severity: incident.severity,
            entityType: "enterprise_incident",
            entityId: incident.id,
            payload: {
                incidentCode: incident.incidentCode,
                title: incident.title,
                affectedServices: incident.affectedServices,
            },
        });
        return incident;
    }
    async list(status) {
        const incidents = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents);
        return incidents
            .filter((incident) => !status ||
            incident.status === status)
            .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
    }
    async get(id) {
        const incident = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, id);
        if (!incident) {
            throw new common_1.NotFoundException(`Enterprise incident ${id} was not found`);
        }
        return incident;
    }
    async updateStatus(id, status, actor = "system") {
        const incident = await this.get(id);
        this.validateStatusTransition(incident.status, status);
        const now = new Date().toISOString();
        const timeline = [
            ...incident.timeline,
            {
                id: (0, node_crypto_1.randomUUID)(),
                timestamp: now,
                eventType: "incident_status_changed",
                description: `Incident status changed from ${incident.status} to ${status}`,
                actor,
                metadata: {
                    previousStatus: incident.status,
                    currentStatus: status,
                },
            },
        ];
        const updated = {
            ...incident,
            status,
            declaredAt: status === "declared"
                ? incident.declaredAt ?? now
                : incident.declaredAt,
            containedAt: status === "contained"
                ? incident.containedAt ?? now
                : incident.containedAt,
            resolvedAt: status === "resolved"
                ? incident.resolvedAt ?? now
                : incident.resolvedAt,
            closedAt: status === "closed"
                ? incident.closedAt ?? now
                : incident.closedAt,
            timeline,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, id, updated);
        await this.events.publish({
            eventType: `incident.${status}`,
            source: "IncidentCommandService",
            severity: incident.severity,
            entityType: "enterprise_incident",
            entityId: id,
            payload: {
                incidentCode: incident.incidentCode,
                previousStatus: incident.status,
                currentStatus: status,
                actor,
            },
        });
        return updated;
    }
    async assignMember(id, dto) {
        const incident = await this.get(id);
        const alreadyActive = incident.commandTeam.some((member) => member.person === dto.person &&
            member.role === dto.role &&
            member.active);
        if (alreadyActive) {
            return incident;
        }
        const now = new Date().toISOString();
        let commandTeam = incident.commandTeam;
        if (dto.role ===
            "incident_commander") {
            commandTeam =
                commandTeam.map((member) => member.role ===
                    "incident_commander"
                    ? {
                        ...member,
                        active: false,
                    }
                    : member);
        }
        commandTeam = [
            ...commandTeam,
            {
                id: (0, node_crypto_1.randomUUID)(),
                person: dto.person,
                role: dto.role,
                assignedAt: now,
                active: true,
            },
        ];
        const updated = {
            ...incident,
            commander: dto.role ===
                "incident_commander"
                ? dto.person
                : incident.commander,
            commandTeam,
            timeline: [
                ...incident.timeline,
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    timestamp: now,
                    eventType: "command_member_assigned",
                    description: `${dto.person} assigned as ${dto.role}`,
                    actor: "system",
                    metadata: {
                        person: dto.person,
                        role: dto.role,
                    },
                },
            ],
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, id, updated);
        return updated;
    }
    async addTimeline(id, dto) {
        const incident = await this.get(id);
        const now = new Date().toISOString();
        const updated = {
            ...incident,
            timeline: [
                ...incident.timeline,
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    timestamp: now,
                    eventType: dto.eventType,
                    description: dto.description,
                    actor: dto.actor,
                    metadata: dto.metadata ?? {},
                },
            ],
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, id, updated);
        return updated;
    }
    async addAction(id, dto) {
        const incident = await this.get(id);
        const now = new Date().toISOString();
        const action = {
            id: (0, node_crypto_1.randomUUID)(),
            title: dto.title,
            description: dto.description,
            owner: dto.owner,
            status: "planned",
            priority: dto.priority,
            dueAt: dto.dueAt,
            dependencies: dto.dependencies ?? [],
            evidenceReferences: dto.evidenceReferences ?? [],
        };
        const updated = {
            ...incident,
            actions: [
                ...incident.actions,
                action,
            ],
            timeline: [
                ...incident.timeline,
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    timestamp: now,
                    eventType: "incident_action_created",
                    description: `Incident action created: ${action.title}`,
                    actor: dto.owner,
                    metadata: {
                        actionId: action.id,
                        priority: action.priority,
                    },
                },
            ],
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, id, updated);
        return updated;
    }
    async updateActionStatus(incidentId, actionId, status, actor = "system") {
        const incident = await this.get(incidentId);
        const action = incident.actions.find((item) => item.id === actionId);
        if (!action) {
            throw new common_1.NotFoundException(`Incident action ${actionId} was not found`);
        }
        const now = new Date().toISOString();
        const actions = incident.actions.map((item) => item.id === actionId
            ? {
                ...item,
                status,
                completedAt: status === "completed"
                    ? now
                    : item.completedAt,
            }
            : item);
        const updated = {
            ...incident,
            actions,
            timeline: [
                ...incident.timeline,
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    timestamp: now,
                    eventType: "incident_action_status_changed",
                    description: `Action ${action.title} changed to ${status}`,
                    actor,
                    metadata: {
                        actionId,
                        status,
                    },
                },
            ],
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.enterpriseIncidents, incidentId, updated);
        return updated;
    }
    async summary() {
        const incidents = await this.list();
        const open = incidents.filter((incident) => !["resolved", "closed"].includes(incident.status));
        return {
            total: incidents.length,
            open: open.length,
            criticalOpen: open.filter((incident) => incident.severity ===
                "critical").length,
            declared: incidents.filter((incident) => incident.status ===
                "declared").length,
            recovering: incidents.filter((incident) => incident.status ===
                "recovering").length,
            resolved: incidents.filter((incident) => ["resolved", "closed"].includes(incident.status)).length,
        };
    }
    validateStatusTransition(current, target) {
        const transitions = {
            detected: [
                "triaged",
                "declared",
                "closed",
            ],
            triaged: [
                "declared",
                "contained",
                "closed",
            ],
            declared: [
                "contained",
                "recovering",
                "resolved",
            ],
            contained: [
                "recovering",
                "resolved",
            ],
            recovering: [
                "contained",
                "resolved",
            ],
            resolved: [
                "closed",
                "recovering",
            ],
            closed: [],
        };
        if (current !== target &&
            !transitions[current].includes(target)) {
            throw new common_1.BadRequestException(`Invalid incident transition from ${current} to ${target}`);
        }
    }
};
exports.IncidentCommandService = IncidentCommandService;
exports.IncidentCommandService = IncidentCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService,
        platform_event_bus_service_1.PlatformEventBusService])
], IncidentCommandService);
//# sourceMappingURL=incident-command.service.js.map