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
exports.EnterpriseRiskService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
let EnterpriseRiskService = class EnterpriseRiskService {
    constructor(storage) {
        this.storage = storage;
        this.collection = "enterprise-risks";
    }
    async create(dto) {
        const risks = await this.storage.readCollection(this.collection);
        const duplicate = risks.find((risk) => risk.riskCode === dto.riskCode);
        if (duplicate) {
            throw new Error(`Risk code ${dto.riskCode} already exists`);
        }
        const inherentScore = dto.likelihood * dto.impact;
        const residualScore = dto.residualScore ?? inherentScore;
        const now = new Date().toISOString();
        const risk = {
            id: (0, node_crypto_1.randomUUID)(),
            riskCode: dto.riskCode,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            owner: dto.owner,
            likelihood: dto.likelihood,
            impact: dto.impact,
            inherentScore,
            residualScore,
            severity: this.scoreToSeverity(residualScore),
            status: dto.status ?? "identified",
            controls: dto.controls ?? [],
            treatmentPlan: dto.treatmentPlan,
            reviewDate: dto.reviewDate,
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        risks.push(risk);
        await this.storage.writeCollection(this.collection, risks);
        return risk;
    }
    async list(status) {
        const risks = await this.storage.readCollection(this.collection);
        return risks
            .filter((risk) => !status || risk.status === status)
            .sort((a, b) => b.residualScore - a.residualScore ||
            b.createdAt.localeCompare(a.createdAt));
    }
    async get(id) {
        const risk = await this.storage.findById(this.collection, id);
        if (!risk) {
            throw new common_1.NotFoundException(`Enterprise risk ${id} was not found`);
        }
        return risk;
    }
    async updateStatus(id, status) {
        const risk = await this.get(id);
        const now = new Date().toISOString();
        const updated = {
            ...risk,
            status,
            updatedAt: now,
        };
        await this.storage.replaceById(this.collection, id, updated);
        return updated;
    }
    async seedDefaults() {
        const risks = await this.storage.readCollection(this.collection);
        const defaults = [
            {
                riskCode: "AVOS-RISK-001",
                title: "Cryptographic key rotation delay",
                description: "Signing or encryption keys may remain active beyond their approved rotation period.",
                category: "cryptography",
                owner: "Security Operations",
                likelihood: 2,
                impact: 5,
                residualScore: 6,
                status: "mitigating",
                controls: [
                    "AVOS-ASSURANCE-006",
                ],
                treatmentPlan: "Track every key version and enforce rotation-due alerts.",
                metadata: {
                    strategic: true,
                },
            },
            {
                riskCode: "AVOS-RISK-002",
                title: "Compliance configuration drift",
                description: "Runtime or policy configuration may drift from an approved compliance baseline.",
                category: "compliance",
                owner: "Governance",
                likelihood: 3,
                impact: 4,
                residualScore: 8,
                status: "mitigating",
                controls: [
                    "AVOS-ASSURANCE-001",
                    "AVOS-ASSURANCE-002",
                ],
                treatmentPlan: "Use fingerprints, drift records and remediation workflows.",
                metadata: {
                    strategic: true,
                },
            },
            {
                riskCode: "AVOS-RISK-003",
                title: "Security evidence retention failure",
                description: "Evidence may be deleted or archived outside approved lifecycle requirements.",
                category: "evidence-governance",
                owner: "Compliance Operations",
                likelihood: 2,
                impact: 5,
                residualScore: 5,
                status: "assessed",
                controls: [
                    "AVOS-ASSURANCE-001",
                ],
                treatmentPlan: "Apply versioned retention policies with legal-hold support.",
                metadata: {
                    strategic: true,
                },
            },
        ];
        let created = 0;
        for (const dto of defaults) {
            if (risks.some((risk) => risk.riskCode === dto.riskCode)) {
                continue;
            }
            const now = new Date().toISOString();
            const inherentScore = dto.likelihood * dto.impact;
            const residualScore = dto.residualScore ?? inherentScore;
            risks.push({
                id: (0, node_crypto_1.randomUUID)(),
                riskCode: dto.riskCode,
                title: dto.title,
                description: dto.description,
                category: dto.category,
                owner: dto.owner,
                likelihood: dto.likelihood,
                impact: dto.impact,
                inherentScore,
                residualScore,
                severity: this.scoreToSeverity(residualScore),
                status: dto.status ?? "identified",
                controls: dto.controls ?? [],
                treatmentPlan: dto.treatmentPlan,
                reviewDate: dto.reviewDate,
                metadata: dto.metadata ?? {},
                createdAt: now,
                updatedAt: now,
            });
            created += 1;
        }
        await this.storage.writeCollection(this.collection, risks);
        return {
            created,
            total: risks.length,
        };
    }
    async summary() {
        const risks = await this.list();
        const openRisks = risks.filter((risk) => risk.status !== "closed");
        const aggregateResidualScore = openRisks.reduce((sum, risk) => sum + risk.residualScore, 0);
        const maximumPossible = openRisks.length * 25;
        const normalizedRiskScore = maximumPossible === 0
            ? 0
            : Math.round((aggregateResidualScore / maximumPossible) *
                100);
        return {
            total: risks.length,
            open: openRisks.length,
            critical: openRisks.filter((risk) => risk.severity === "critical").length,
            high: openRisks.filter((risk) => risk.severity === "high").length,
            aggregateResidualScore,
            normalizedRiskScore,
        };
    }
    scoreToSeverity(score) {
        if (score >= 20) {
            return "critical";
        }
        if (score >= 12) {
            return "high";
        }
        if (score >= 6) {
            return "medium";
        }
        if (score >= 2) {
            return "low";
        }
        return "informational";
    }
};
exports.EnterpriseRiskService = EnterpriseRiskService;
exports.EnterpriseRiskService = EnterpriseRiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], EnterpriseRiskService);
//# sourceMappingURL=enterprise-risk.service.js.map