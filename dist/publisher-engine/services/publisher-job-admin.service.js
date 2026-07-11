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
exports.PublisherJobAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_job_validator_1 = require("../validators/publisher-job.validator");
let PublisherJobAdminService = class PublisherJobAdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const error = publisher_job_validator_1.PublisherJobValidator.validateCreate(dto);
        if (error)
            return { success: false, message: error };
        const job = await this.prisma.publishJob.create({
            data: {
                title: String(dto.title).trim(),
                content: dto.content ?? null,
                campaignId: dto.campaignId ?? null,
                channelId: dto.channelId ?? null,
                status: "queued",
                priority: dto.priority ?? "normal",
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                maxRetries: dto.maxRetries ?? 3,
                result: dto.result ?? {},
            },
        });
        return { success: true, job };
    }
    async createMany(items) {
        const created = [];
        for (const item of items ?? []) {
            const result = await this.create(item);
            if (result.success)
                created.push(result.job);
        }
        return {
            success: true,
            requested: items?.length ?? 0,
            created: created.length,
            jobs: created,
        };
    }
    async list(query) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.campaignId)
            where.campaignId = query.campaignId;
        if (query.priority)
            where.priority = query.priority;
        const limit = Math.min(Math.max(Number(query.limit ?? 50), 1), 200);
        const jobs = await this.prisma.publishJob.findMany({
            where,
            orderBy: [{ createdAt: "desc" }],
            take: limit,
        });
        return {
            success: true,
            count: jobs.length,
            jobs,
        };
    }
    async get(id) {
        const job = await this.prisma.publishJob.findUnique({ where: { id } });
        if (!job)
            return { success: false, message: "PublishJob not found" };
        return { success: true, job };
    }
    async cancel(id) {
        const job = await this.prisma.publishJob.findUnique({ where: { id } });
        if (!job)
            return { success: false, message: "PublishJob not found" };
        if (["published", "dead"].includes(job.status)) {
            return { success: false, message: `Cannot cancel ${job.status} job` };
        }
        const updated = await this.prisma.publishJob.update({
            where: { id },
            data: {
                status: "skipped",
                lockedAt: null,
                lockToken: null,
                workerId: null,
                result: {
                    ...(job.result ?? {}),
                    cancellation: {
                        cancelledAt: new Date().toISOString(),
                        reason: "cancelled_by_api",
                    },
                },
                updatedAt: new Date(),
            },
        });
        return { success: true, job: updated };
    }
    async retry(id) {
        const job = await this.prisma.publishJob.findUnique({ where: { id } });
        if (!job)
            return { success: false, message: "PublishJob not found" };
        const updated = await this.prisma.publishJob.update({
            where: { id },
            data: {
                status: "queued",
                failedAt: null,
                lockedAt: null,
                lockToken: null,
                workerId: null,
                lastError: null,
                updatedAt: new Date(),
            },
        });
        return { success: true, job: updated };
    }
    async retryFailed(limit = 50) {
        const jobs = await this.prisma.publishJob.findMany({
            where: { status: { in: ["failed", "dead"] } },
            take: Math.min(Math.max(Number(limit) || 50, 1), 200),
            orderBy: { updatedAt: "asc" },
        });
        const updated = [];
        for (const job of jobs) {
            updated.push(await this.prisma.publishJob.update({
                where: { id: job.id },
                data: {
                    status: "queued",
                    failedAt: null,
                    lockedAt: null,
                    lockToken: null,
                    workerId: null,
                    lastError: null,
                    updatedAt: new Date(),
                },
            }));
        }
        return { success: true, retried: updated.length, jobs: updated };
    }
};
exports.PublisherJobAdminService = PublisherJobAdminService;
exports.PublisherJobAdminService = PublisherJobAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherJobAdminService);
//# sourceMappingURL=publisher-job-admin.service.js.map