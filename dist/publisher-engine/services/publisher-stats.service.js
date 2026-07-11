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
exports.PublisherStatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherStatsService = class PublisherStatsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async byChannel() {
        const jobs = await this.prisma.publishJob.findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
        });
        const stats = {};
        for (const job of jobs) {
            const result = job.result ?? {};
            const channel = result.channel ?? result.publisher?.channel ?? "internal";
            stats[channel] ??= { total: 0, published: 0, failed: 0, queued: 0, dead: 0 };
            stats[channel].total++;
            stats[channel][job.status] = (stats[channel][job.status] ?? 0) + 1;
        }
        return { success: true, channels: stats };
    }
};
exports.PublisherStatsService = PublisherStatsService;
exports.PublisherStatsService = PublisherStatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherStatsService);
//# sourceMappingURL=publisher-stats.service.js.map