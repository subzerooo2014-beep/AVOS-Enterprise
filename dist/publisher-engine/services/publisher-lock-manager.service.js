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
exports.PublisherLockManagerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_lock_util_1 = require("../utils/publisher-lock.util");
let PublisherLockManagerService = class PublisherLockManagerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async releaseExpired(minutes = 10) {
        const jobs = await this.prisma.publishJob.findMany({
            where: {
                status: "processing",
            },
            take: 500,
        });
        let released = 0;
        for (const job of jobs) {
            if (!publisher_lock_util_1.PublisherLockUtil.expired(job.lockedAt, minutes))
                continue;
            await this.prisma.publishJob.update({
                where: { id: job.id },
                data: {
                    status: "queued",
                    lockedAt: null,
                    lockToken: null,
                    workerId: null,
                    updatedAt: new Date(),
                },
            });
            released++;
        }
        return {
            success: true,
            released,
        };
    }
};
exports.PublisherLockManagerService = PublisherLockManagerService;
exports.PublisherLockManagerService = PublisherLockManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherLockManagerService);
//# sourceMappingURL=publisher-lock-manager.service.js.map