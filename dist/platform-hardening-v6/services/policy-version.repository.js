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
exports.PolicyVersionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PolicyVersionRepository = class PolicyVersionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get policyModel() {
        return this.prisma.persistentRuntimePolicy;
    }
    get versionModel() {
        return this.prisma.persistentPolicyVersion;
    }
    findPolicy(id) {
        return this.policyModel.findUnique({
            where: { id },
            include: {
                currentVersionRecord: true,
            },
        });
    }
    findPolicies() {
        return this.policyModel.findMany({
            include: {
                currentVersionRecord: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }
    findVersion(policyId, version) {
        return this.versionModel.findUnique({
            where: {
                policyId_version: {
                    policyId,
                    version,
                },
            },
        });
    }
    findVersions(policyId, limit) {
        return this.versionModel.findMany({
            where: { policyId },
            orderBy: {
                version: "desc",
            },
            take: limit,
        });
    }
    countPolicies() {
        return this.policyModel.count();
    }
    countVersions() {
        return this.versionModel.count();
    }
    transaction(callback) {
        return this.prisma.$transaction(callback);
    }
};
exports.PolicyVersionRepository = PolicyVersionRepository;
exports.PolicyVersionRepository = PolicyVersionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PolicyVersionRepository);
//# sourceMappingURL=policy-version.repository.js.map