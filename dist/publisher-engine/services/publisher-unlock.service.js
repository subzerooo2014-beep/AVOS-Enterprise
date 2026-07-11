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
exports.PublisherUnlockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherUnlockService = class PublisherUnlockService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async unlockExpired(minutes = 10) {
        const threshold = new Date(Date.now() - Number(minutes) * 60 * 1000);
        const jobs = await this.prisma.publishJob.findMany({
            where: {
                status: "processing",
                lockedAt: { lt: threshold },
            },
            take: 100,
        });
        const unlocked = [];
        for (const job of jobs) {
            unlocked.push(await this.prisma.publishJob.update({
                where: { id: job.id },
                data: {
                    status: "queued",
                    lockedAt: null,
                    lockToken: null,
                    workerId: null,
                    lastError: "Auto-unlocked expired processing job",
                    updatedAt: new Date(),
                },
            }));
        }
        return {
            success: true,
            unlocked: unlocked.length,
            jobs: unlocked,
        };
    }
};
exports.PublisherUnlockService = PublisherUnlockService;
exports.PublisherUnlockService = PublisherUnlockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherUnlockService);
//# sourceMappingURL=publisher-unlock.service.js.map