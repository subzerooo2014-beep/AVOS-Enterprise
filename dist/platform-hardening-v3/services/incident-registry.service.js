"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentRegistryService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const incident_status_enum_1 = require("../enums/incident-status.enum");
let IncidentRegistryService = class IncidentRegistryService {
    constructor() {
        this.incidents = new Map();
    }
    register(input) {
        const existing = Array.from(this.incidents.values()).find((item) => item.fingerprint === input.fingerprint &&
            item.status !== incident_status_enum_1.IncidentStatus.RESOLVED);
        const timestamp = new Date().toISOString();
        if (existing) {
            existing.lastSeenAt = timestamp;
            existing.occurrenceCount += 1;
            existing.message = input.message;
            existing.correlationId = input.correlationId;
            existing.traceId = input.traceId;
            existing.method = input.method;
            existing.path = input.path;
            existing.statusCode =
                input.classification.statusCode;
            existing.metadata = {
                ...(existing.metadata ?? {}),
                ...(input.metadata ?? {}),
            };
            this.incidents.set(existing.id, existing);
            return { ...existing };
        }
        const incident = {
            id: (0, node_crypto_1.randomUUID)(),
            fingerprint: input.fingerprint,
            title: input.title,
            message: input.message,
            category: input.classification.category,
            severity: input.classification.severity,
            status: incident_status_enum_1.IncidentStatus.OPEN,
            correlationId: input.correlationId,
            traceId: input.traceId,
            method: input.method,
            path: input.path,
            statusCode: input.classification.statusCode,
            firstSeenAt: timestamp,
            lastSeenAt: timestamp,
            occurrenceCount: 1,
            metadata: input.metadata,
        };
        this.incidents.set(incident.id, incident);
        this.trim();
        return { ...incident };
    }
    findAll(options) {
        const limit = Math.min(Math.max(options?.limit ?? 100, 1), 1000);
        return Array.from(this.incidents.values())
            .filter((item) => !options?.status ||
            item.status === options.status)
            .sort((left, right) => new Date(right.lastSeenAt).getTime() -
            new Date(left.lastSeenAt).getTime())
            .slice(0, limit)
            .map((item) => ({ ...item }));
    }
    findOne(id) {
        const incident = this.incidents.get(id);
        return incident ? { ...incident } : null;
    }
    acknowledge(id) {
        const incident = this.incidents.get(id);
        if (!incident) {
            return null;
        }
        incident.status = incident_status_enum_1.IncidentStatus.ACKNOWLEDGED;
        incident.acknowledgedAt =
            new Date().toISOString();
        this.incidents.set(id, incident);
        return { ...incident };
    }
    resolve(id) {
        const incident = this.incidents.get(id);
        if (!incident) {
            return null;
        }
        incident.status = incident_status_enum_1.IncidentStatus.RESOLVED;
        incident.resolvedAt =
            new Date().toISOString();
        this.incidents.set(id, incident);
        return { ...incident };
    }
    getSummary() {
        const incidents = Array.from(this.incidents.values());
        return {
            total: incidents.length,
            open: incidents.filter((item) => item.status === incident_status_enum_1.IncidentStatus.OPEN).length,
            acknowledged: incidents.filter((item) => item.status ===
                incident_status_enum_1.IncidentStatus.ACKNOWLEDGED).length,
            resolved: incidents.filter((item) => item.status === incident_status_enum_1.IncidentStatus.RESOLVED).length,
            critical: incidents.filter((item) => item.severity === "critical").length,
            error: incidents.filter((item) => item.severity === "error").length,
            warning: incidents.filter((item) => item.severity === "warning").length,
        };
    }
    trim() {
        const maximumIncidents = 2000;
        if (this.incidents.size <= maximumIncidents) {
            return;
        }
        const oldest = Array.from(this.incidents.values())
            .sort((left, right) => new Date(left.lastSeenAt).getTime() -
            new Date(right.lastSeenAt).getTime())
            .slice(0, this.incidents.size - maximumIncidents);
        for (const incident of oldest) {
            this.incidents.delete(incident.id);
        }
    }
};
exports.IncidentRegistryService = IncidentRegistryService;
exports.IncidentRegistryService = IncidentRegistryService = __decorate([
    (0, common_1.Injectable)()
], IncidentRegistryService);
//# sourceMappingURL=incident-registry.service.js.map