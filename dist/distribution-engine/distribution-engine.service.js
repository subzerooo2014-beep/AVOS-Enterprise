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
exports.DistributionEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DistributionEngineService = class DistributionEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createChannel(data) {
        return this.prisma.distributionChannel.create({
            data: {
                name: data.name,
                type: data.type || "social",
                country: data.country,
                language: data.language || "ar",
                status: data.status || "active",
                score: Number(data.score || 50),
                metadata: data.metadata || {},
            },
        });
    }
    listChannels() {
        return this.prisma.distributionChannel.findMany({ orderBy: { createdAt: "desc" } });
    }
    async createPublishJob(data) {
        return this.prisma.publishJob.create({
            data: {
                campaignId: data.campaignId,
                channelId: data.channelId,
                title: data.title,
                content: data.content,
                status: "queued",
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
                result: {
                    aiReason: "Publish job queued by AVOS smart distribution engine.",
                },
            },
        });
    }
    listJobs() {
        return this.prisma.publishJob.findMany({ orderBy: { createdAt: "desc" } });
    }
    async markPublished(id, result = {}) {
        const job = await this.prisma.publishJob.findUnique({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException("Publish job not found");
        return this.prisma.publishJob.update({
            where: { id },
            data: {
                status: "published",
                publishedAt: new Date(),
                result: {
                    ...(job.result || {}),
                    ...result,
                    aiNextAction: "Monitor engagement and republish if performance drops.",
                },
            },
        });
    }
    async autoRepublish(id, metrics = {}) {
        const job = await this.prisma.publishJob.findUnique({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException("Publish job not found");
        const weak = metrics.views < 100 || metrics.leads < 3 || metrics.weakEngagement === true;
        return this.prisma.publishJob.create({
            data: {
                campaignId: job.campaignId,
                channelId: job.channelId,
                title: weak ? `${job.title} - AI Optimized` : job.title,
                content: job.content,
                status: weak ? "queued" : "skipped",
                scheduledAt: weak ? new Date(Date.now() + 60 * 60 * 1000) : null,
                result: {
                    previousJobId: id,
                    metrics,
                    aiReason: weak
                        ? "Engagement was weak, AI scheduled a republish."
                        : "Performance is acceptable, republish skipped.",
                },
            },
        });
    }
};
exports.DistributionEngineService = DistributionEngineService;
exports.DistributionEngineService = DistributionEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DistributionEngineService);
//# sourceMappingURL=distribution-engine.service.js.map