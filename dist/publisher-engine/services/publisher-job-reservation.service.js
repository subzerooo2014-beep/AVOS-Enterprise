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
var PublisherJobReservationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobReservationService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherJobReservationService = PublisherJobReservationService_1 = class PublisherJobReservationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PublisherJobReservationService_1.name);
    }
    async reserveBatch(options) {
        const workerId = this.requireWorkerId(options.workerId);
        const limit = this.normalizeLimit(options.limit);
        const reservedAt = new Date();
        const jobs = await this.prisma.$transaction(async (transaction) => {
            const candidates = await transaction.publishJob.findMany({
                where: {
                    status: {
                        in: ["queued", "retrying"],
                    },
                    lockToken: null,
                    AND: [
                        {
                            OR: [
                                {
                                    scheduledAt: null,
                                },
                                {
                                    scheduledAt: {
                                        lte: reservedAt,
                                    },
                                },
                            ],
                        },
                    ],
                },
                orderBy: [
                    {
                        createdAt: "asc",
                    },
                ],
                take: limit,
            });
            const reservedJobs = [];
            for (const candidate of candidates) {
                const lockToken = (0, node_crypto_1.randomUUID)();
                const claimed = await transaction.publishJob.updateMany({
                    where: {
                        id: candidate.id,
                        status: {
                            in: ["queued", "retrying"],
                        },
                        lockToken: null,
                    },
                    data: {
                        workerId,
                        lockToken,
                        lockedAt: reservedAt,
                    },
                });
                if (claimed.count !== 1) {
                    continue;
                }
                reservedJobs.push({
                    ...candidate,
                    workerId,
                    lockToken,
                    lockedAt: reservedAt,
                });
            }
            return reservedJobs;
        }, {
            timeout: 30_000,
        });
        this.logger.log(`Publisher jobs reserved: workerId=${workerId}, requested=${limit}, reserved=${jobs.length}`);
        return {
            success: true,
            workerId,
            requested: limit,
            selected: jobs.length,
            reserved: jobs.length,
            jobs,
            reservedAt,
        };
    }
    async reserveOne(jobId, workerId) {
        const normalizedJobId = this.requireText(jobId, "jobId");
        const normalizedWorkerId = this.requireWorkerId(workerId);
        const lockToken = (0, node_crypto_1.randomUUID)();
        const lockedAt = new Date();
        return this.prisma.$transaction(async (transaction) => {
            const claimed = await transaction.publishJob.updateMany({
                where: {
                    id: normalizedJobId,
                    status: {
                        in: ["queued", "retrying"],
                    },
                    lockToken: null,
                },
                data: {
                    workerId: normalizedWorkerId,
                    lockToken,
                    lockedAt,
                },
            });
            if (claimed.count !== 1) {
                return null;
            }
            return transaction.publishJob.findUnique({
                where: {
                    id: normalizedJobId,
                },
            });
        }, {
            timeout: 30_000,
        });
    }
    async release(jobId, lockToken) {
        const result = await this.prisma.publishJob.updateMany({
            where: {
                id: this.requireText(jobId, "jobId"),
                lockToken: this.requireText(lockToken, "lockToken"),
            },
            data: {
                workerId: null,
                lockToken: null,
                lockedAt: null,
            },
        });
        return result.count === 1;
    }
    async releaseExpired(timeoutMinutes = 10) {
        const normalizedTimeout = Number.isFinite(Number(timeoutMinutes))
            ? Math.max(1, Math.trunc(Number(timeoutMinutes)))
            : 10;
        const expiresBefore = new Date(Date.now() - normalizedTimeout * 60_000);
        const result = await this.prisma.publishJob.updateMany({
            where: {
                status: {
                    in: ["queued", "retrying", "locked", "processing"],
                },
                lockedAt: {
                    lt: expiresBefore,
                },
                lockToken: {
                    not: null,
                },
            },
            data: {
                workerId: null,
                lockToken: null,
                lockedAt: null,
                status: "queued",
            },
        });
        if (result.count > 0) {
            this.logger.warn(`Released ${result.count} expired publisher job lock(s)`);
        }
        return result.count;
    }
    normalizeLimit(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return 20;
        }
        return Math.min(Math.max(Math.trunc(numeric), 1), 200);
    }
    requireWorkerId(value) {
        return this.requireText(value, "workerId");
    }
    requireText(value, field) {
        if (typeof value !== "string" || !value.trim()) {
            throw new Error(`${field} must be a non-empty string`);
        }
        return value.trim();
    }
};
exports.PublisherJobReservationService = PublisherJobReservationService;
exports.PublisherJobReservationService = PublisherJobReservationService = PublisherJobReservationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherJobReservationService);
//# sourceMappingURL=publisher-job-reservation.service.js.map