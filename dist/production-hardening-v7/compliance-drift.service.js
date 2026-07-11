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
exports.ComplianceDriftService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
let ComplianceDriftService = class ComplianceDriftService {
    constructor(storage) {
        this.storage = storage;
        this.collection = "compliance-drift-events";
    }
    async detect(dto) {
        const fingerprint = this.createFingerprint({
            domain: dto.domain,
            resource: dto.resource,
            previousState: dto.previousState,
            currentState: dto.currentState,
        });
        const events = await this.storage.readCollection(this.collection);
        const activeDuplicate = events.find((event) => event.fingerprint === fingerprint &&
            event.status !== "resolved" &&
            event.status !== "ignored");
        if (activeDuplicate) {
            return activeDuplicate;
        }
        const now = new Date().toISOString();
        const event = {
            id: (0, node_crypto_1.randomUUID)(),
            fingerprint,
            domain: dto.domain,
            resource: dto.resource,
            previousState: dto.previousState,
            currentState: dto.currentState,
            severity: dto.severity,
            status: "open",
            detectedAt: now,
            description: dto.description,
            createdAt: now,
            updatedAt: now,
        };
        events.push(event);
        await this.storage.writeCollection(this.collection, events);
        return event;
    }
    async list(status) {
        const events = await this.storage.readCollection(this.collection);
        return events
            .filter((event) => !status || event.status === status)
            .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
    }
    async updateStatus(id, status) {
        const existing = await this.storage.findById(this.collection, id);
        if (!existing) {
            throw new common_1.NotFoundException(`Compliance drift event ${id} was not found`);
        }
        const now = new Date().toISOString();
        const updated = {
            ...existing,
            status,
            resolvedAt: status === "resolved" ? now : existing.resolvedAt,
            updatedAt: now,
        };
        await this.storage.replaceById(this.collection, id, updated);
        return updated;
    }
    async summary() {
        const events = await this.list();
        return {
            total: events.length,
            open: events.filter((event) => event.status === "open").length,
            acknowledged: events.filter((event) => event.status === "acknowledged").length,
            resolved: events.filter((event) => event.status === "resolved").length,
            ignored: events.filter((event) => event.status === "ignored").length,
            criticalOpen: events.filter((event) => event.status === "open" &&
                event.severity === "critical").length,
        };
    }
    createFingerprint(value) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(this.stableStringify(value))
            .digest("hex");
    }
    stableStringify(value) {
        if (value === null ||
            typeof value !== "object") {
            return JSON.stringify(value);
        }
        if (Array.isArray(value)) {
            return `[${value
                .map((item) => this.stableStringify(item))
                .join(",")}]`;
        }
        const record = value;
        const keys = Object.keys(record).sort();
        return `{${keys
            .map((key) => `${JSON.stringify(key)}:${this.stableStringify(record[key])}`)
            .join(",")}}`;
    }
};
exports.ComplianceDriftService = ComplianceDriftService;
exports.ComplianceDriftService = ComplianceDriftService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], ComplianceDriftService);
//# sourceMappingURL=compliance-drift.service.js.map