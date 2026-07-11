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
exports.PublisherPerformanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherPerformanceService = class PublisherPerformanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async report() {
        const jobs = await this.prisma.publishJob.findMany({
            take: 1000,
        });
        let execution = 0;
        let counted = 0;
        for (const job of jobs) {
            const ms = job?.result?.execution?.executionMs;
            if (typeof ms === "number") {
                execution += ms;
                counted++;
            }
        }
        return {
            success: true,
            totalJobs: jobs.length,
            measuredJobs: counted,
            averageExecutionMs: counted ? Math.round(execution / counted) : 0,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherPerformanceService = PublisherPerformanceService;
exports.PublisherPerformanceService = PublisherPerformanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherPerformanceService);
//# sourceMappingURL=publisher-performance.service.js.map