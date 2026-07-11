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
exports.GovernanceIntegrityRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GovernanceIntegrityRepository = class GovernanceIntegrityRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get auditModel() {
        return this.prisma
            .persistentAuditEvent;
    }
    get policyVersionModel() {
        return this.prisma
            .persistentPolicyVersion;
    }
    get scanModel() {
        return this.prisma
            .governanceIntegrityScan;
    }
    findAuditAscending() {
        return this.auditModel.findMany({
            orderBy: {
                sequence: "asc",
            },
        });
    }
    findPolicyVersionsAscending() {
        return this.policyVersionModel.findMany({
            orderBy: [
                {
                    policyId: "asc",
                },
                {
                    version: "asc",
                },
            ],
        });
    }
    findUnsignedAudit(limit = 500) {
        return this.auditModel.findMany({
            where: {
                OR: [
                    { signature: null },
                    { signedAt: null },
                    { signatureKeyId: null },
                    { signatureAlgorithm: null },
                ],
            },
            orderBy: {
                sequence: "asc",
            },
            take: limit,
        });
    }
    findUnsignedPolicyVersions(limit = 500) {
        return this.policyVersionModel.findMany({
            where: {
                OR: [
                    { policySignature: null },
                    { signedAt: null },
                    { signatureKeyId: null },
                    { signatureAlgorithm: null },
                ],
            },
            orderBy: [
                {
                    policyId: "asc",
                },
                {
                    version: "asc",
                },
            ],
            take: limit,
        });
    }
    updateAuditSignature(id, data) {
        return this.auditModel.update({
            where: { id },
            data,
        });
    }
    updatePolicySignature(id, data) {
        return this.policyVersionModel.update({
            where: { id },
            data,
        });
    }
    createScan(data) {
        return this.scanModel.create({
            data,
        });
    }
    findScans(limit = 100) {
        return this.scanModel.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: Math.min(Math.max(limit, 1), 1000),
        });
    }
    findLatestScan() {
        return this.scanModel.findFirst({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
};
exports.GovernanceIntegrityRepository = GovernanceIntegrityRepository;
exports.GovernanceIntegrityRepository = GovernanceIntegrityRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GovernanceIntegrityRepository);
//# sourceMappingURL=governance-integrity.repository.js.map