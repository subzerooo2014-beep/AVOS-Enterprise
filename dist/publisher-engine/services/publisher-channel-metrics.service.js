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
exports.PublisherChannelMetricsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherChannelMetricsService = class PublisherChannelMetricsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary() {
        const jobs = await this.prisma.publishJob.findMany({
            take: 2000,
            orderBy: { createdAt: "desc" },
        });
        const channels = {};
        for (const job of jobs) {
            const channel = job?.result?.publisher?.channel ??
                job?.result?.channel ??
                "internal";
            channels[channel] ??= {
                total: 0,
                published: 0,
                failed: 0,
                queued: 0,
                processing: 0,
                skipped: 0,
                dead: 0,
            };
            channels[channel].total++;
            channels[channel][job.status] =
                (channels[channel][job.status] ?? 0) + 1;
        }
        return {
            success: true,
            channels,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherChannelMetricsService = PublisherChannelMetricsService;
exports.PublisherChannelMetricsService = PublisherChannelMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherChannelMetricsService);
//# sourceMappingURL=publisher-channel-metrics.service.js.map