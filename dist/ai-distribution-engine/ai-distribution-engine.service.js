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
exports.AiDistributionEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_action_log_service_1 = require("../ai-action-log/ai-action-log.service");
let AiDistributionEngineService = class AiDistributionEngineService {
    constructor(prisma, logs) {
        this.prisma = prisma;
        this.logs = logs;
    }
    async dashboard() {
        const jobs = await this.prisma.publishJob.findMany({
            orderBy: { createdAt: "desc" },
        });
        const summary = {
            total: jobs.length,
            queued: jobs.filter((j) => j.status === "queued").length,
            published: jobs.filter((j) => j.status === "published").length,
            failed: jobs.filter((j) => j.status === "failed").length,
            channels: this.groupByChannel(jobs),
        };
        return {
            success: true,
            summary,
            latest: jobs.slice(0, 20),
        };
    }
    async processQueued(limit = 20) {
        const jobs = await this.prisma.publishJob.findMany({
            where: { status: "queued" },
            orderBy: { createdAt: "asc" },
            take: limit,
        });
        const processed = [];
        for (const job of jobs) {
            const channel = this.channelOf(job);
            const entityId = this.entityIdOf(job);
            const result = this.simulatePublish(job, channel);
            const updated = await this.prisma.publishJob.update({
                where: { id: job.id },
                data: {
                    status: result.ok ? "published" : "failed",
                    publishedAt: result.ok ? new Date() : null,
                    result: {
                        ...(job.result ?? {}),
                        distribution: result,
                        processedBy: "AI_DISTRIBUTION_ENGINE_V1",
                    },
                    updatedAt: new Date(),
                },
            });
            if (entityId) {
                await this.logs.write(entityId, result.ok ? `DISTRIBUTED:${channel}` : `DISTRIBUTION_FAILED:${channel}`, result.ok ? "completed" : "failed");
            }
            processed.push(updated);
        }
        return {
            success: true,
            processedCount: processed.length,
            processed,
        };
    }
    async retryFailed(limit = 20) {
        const jobs = await this.prisma.publishJob.findMany({
            where: { status: "failed" },
            orderBy: { updatedAt: "asc" },
            take: limit,
        });
        const retried = [];
        for (const job of jobs) {
            retried.push(await this.prisma.publishJob.update({
                where: { id: job.id },
                data: {
                    status: "queued",
                    result: {
                        ...(job.result ?? {}),
                        retry: {
                            at: new Date().toISOString(),
                            by: "AI_DISTRIBUTION_ENGINE_V1",
                        },
                    },
                    updatedAt: new Date(),
                },
            }));
        }
        return {
            success: true,
            retriedCount: retried.length,
            retried,
        };
    }
    async channelReport(channel) {
        const jobs = await this.prisma.publishJob.findMany({
            where: {
                OR: [
                    { title: { contains: channel } },
                    { content: { contains: channel } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
        return {
            success: true,
            channel,
            total: jobs.length,
            queued: jobs.filter((j) => j.status === "queued").length,
            published: jobs.filter((j) => j.status === "published").length,
            failed: jobs.filter((j) => j.status === "failed").length,
            jobs,
        };
    }
    async vehicleReport(vehicleId) {
        const jobs = await this.prisma.publishJob.findMany({
            where: {
                OR: [
                    { content: { contains: vehicleId } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
        return {
            success: true,
            vehicleId,
            total: jobs.length,
            queued: jobs.filter((j) => j.status === "queued").length,
            published: jobs.filter((j) => j.status === "published").length,
            failed: jobs.filter((j) => j.status === "failed").length,
            channels: this.groupByChannel(jobs),
            jobs,
        };
    }
    simulatePublish(job, channel) {
        const reliableChannels = [
            "website",
            "crm_leads",
            "matched_buyers",
            "dealer_network",
            "gcc_export",
            "instagram",
            "tiktok",
            "google_search",
        ];
        const ok = reliableChannels.includes(channel);
        return {
            ok,
            channel,
            externalId: ok ? `AVOS-${channel}-${job.id}` : null,
            message: ok ? "Published successfully by simulated adapter." : "Unsupported channel.",
            publishedAt: ok ? new Date().toISOString() : null,
        };
    }
    channelOf(job) {
        const result = job.result ?? {};
        if (result.channel)
            return result.channel;
        const title = String(job.title ?? "").toLowerCase();
        const known = [
            "website",
            "instagram",
            "tiktok",
            "google_search",
            "matched_buyers",
            "crm_leads",
            "gcc_export",
            "dealer_network",
        ];
        return known.find((c) => title.includes(c)) ?? "internal";
    }
    entityIdOf(job) {
        const result = job.result ?? {};
        if (result.entityId)
            return result.entityId;
        const content = String(job.content ?? "");
        const match = content.match(/cmr[a-z0-9]+/i);
        return match ? match[0] : null;
    }
    groupByChannel(jobs) {
        const map = {};
        for (const job of jobs) {
            const channel = this.channelOf(job);
            map[channel] = (map[channel] ?? 0) + 1;
        }
        return map;
    }
};
exports.AiDistributionEngineService = AiDistributionEngineService;
exports.AiDistributionEngineService = AiDistributionEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_action_log_service_1.AiActionLogService])
], AiDistributionEngineService);
//# sourceMappingURL=ai-distribution-engine.service.js.map