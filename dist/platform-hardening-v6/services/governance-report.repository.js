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
exports.GovernanceReportRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GovernanceReportRepository = class GovernanceReportRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get complianceModel() {
        return this.prisma
            .governanceComplianceSnapshot;
    }
    get evidenceModel() {
        return this.prisma
            .governanceEvidencePackage;
    }
    createCompliance(data) {
        return this.complianceModel.create({
            data,
        });
    }
    findComplianceById(id) {
        return this.complianceModel.findUnique({
            where: { id },
        });
    }
    findComplianceSnapshots(limit) {
        return this.complianceModel.findMany({
            orderBy: {
                generatedAt: "desc",
            },
            take: Math.min(Math.max(limit, 1), 1000),
        });
    }
    findLatestCompliance() {
        return this.complianceModel.findFirst({
            orderBy: {
                generatedAt: "desc",
            },
        });
    }
    countCompliance() {
        return this.complianceModel.count();
    }
    createEvidence(data) {
        return this.evidenceModel.create({
            data,
        });
    }
    findEvidenceById(id) {
        return this.evidenceModel.findUnique({
            where: { id },
        });
    }
    findEvidencePackages(limit) {
        return this.evidenceModel.findMany({
            orderBy: {
                generatedAt: "desc",
            },
            take: Math.min(Math.max(limit, 1), 1000),
        });
    }
    findLatestEvidence() {
        return this.evidenceModel.findFirst({
            orderBy: {
                generatedAt: "desc",
            },
        });
    }
    countEvidence() {
        return this.evidenceModel.count();
    }
};
exports.GovernanceReportRepository = GovernanceReportRepository;
exports.GovernanceReportRepository = GovernanceReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GovernanceReportRepository);
//# sourceMappingURL=governance-report.repository.js.map