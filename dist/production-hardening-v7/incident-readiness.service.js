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
exports.IncidentReadinessService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
let IncidentReadinessService = class IncidentReadinessService {
    constructor(storage) {
        this.storage = storage;
        this.collection = "incident-readiness-assessments";
    }
    async assess() {
        const capabilities = [
            {
                capability: "Persistent audit ledger",
                ready: true,
                score: 100,
                notes: "Persistent audit ledger completed in Production Hardening V6.",
            },
            {
                capability: "Policy version recovery",
                ready: true,
                score: 100,
                notes: "Versioned policies are available for investigation and rollback.",
            },
            {
                capability: "Digital signature verification",
                ready: true,
                score: 100,
                notes: "Digital signature validation is available from V6.",
            },
            {
                capability: "Integrity scanning",
                ready: true,
                score: 100,
                notes: "Integrity scanner is available from V6.",
            },
            {
                capability: "Compliance evidence packaging",
                ready: true,
                score: 100,
                notes: "Compliance snapshots and evidence vault are available.",
            },
            {
                capability: "Continuous control validation",
                ready: true,
                score: 100,
                notes: "Continuous assurance validation is active in V7.",
            },
            {
                capability: "Compliance drift management",
                ready: true,
                score: 100,
                notes: "Persistent drift detection and lifecycle management are active.",
            },
            {
                capability: "Automated external escalation",
                ready: false,
                score: 40,
                notes: "External SOC, email, SMS and paging integrations remain reserved for a later integration pack.",
            },
        ];
        const score = Math.round(capabilities.reduce((sum, capability) => sum + capability.score, 0) / capabilities.length);
        const status = score >= 90
            ? "ready"
            : score >= 60
                ? "partially_ready"
                : "not_ready";
        const recommendations = [];
        if (capabilities.some((capability) => !capability.ready)) {
            recommendations.push("Connect the incident workflow to enterprise notification and escalation providers.");
        }
        recommendations.push("Run an incident readiness assessment after every major hardening release.");
        recommendations.push("Generate and retain an assurance report for every readiness exercise.");
        const now = new Date().toISOString();
        const assessment = {
            id: (0, node_crypto_1.randomUUID)(),
            assessmentName: "AVOS Enterprise Incident Readiness Assessment",
            status,
            score,
            assessedAt: now,
            capabilities,
            recommendations,
            createdAt: now,
            updatedAt: now,
        };
        await this.storage.append(this.collection, assessment);
        return assessment;
    }
    async list() {
        const assessments = await this.storage.readCollection(this.collection);
        return assessments.sort((a, b) => b.assessedAt.localeCompare(a.assessedAt));
    }
    async latest() {
        const assessments = await this.list();
        return assessments[0] ?? null;
    }
};
exports.IncidentReadinessService = IncidentReadinessService;
exports.IncidentReadinessService = IncidentReadinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], IncidentReadinessService);
//# sourceMappingURL=incident-readiness.service.js.map