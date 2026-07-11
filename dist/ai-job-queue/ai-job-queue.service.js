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
exports.AiJobQueueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiJobQueueService = class AiJobQueueService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enqueue(type, payload, priority = 50) {
        return this.prisma.aiActionLog.create({
            data: {
                id: crypto.randomUUID(),
                entityType: "job",
                entityId: payload?.entityId ?? "system",
                action: type,
                status: "queued",
            },
        });
    }
    async queued(limit = 20) {
        const jobs = await this.prisma.aiActionLog.findMany({
            where: {
                entityType: "job",
                status: "queued",
            },
            orderBy: {
                createdAt: "asc",
            },
            take: limit,
        });
        return jobs.sort((a, b) => this.priorityOf(b) - this.priorityOf(a));
    }
    async failed(limit = 20) {
        return this.prisma.aiActionLog.findMany({
            where: {
                entityType: "job",
                status: "failed",
            },
            orderBy: {
                createdAt: "asc",
            },
            take: limit,
        });
    }
    async mark(id, status) {
        return this.prisma.aiActionLog.update({
            where: { id },
            data: { status },
        });
    }
    async retryFailed(limit = 20) {
        const jobs = await this.failed(limit);
        const retried = [];
        for (const job of jobs) {
            retried.push(await this.mark(job.id, "queued"));
        }
        return {
            success: true,
            retriedCount: retried.length,
            retried,
        };
    }
    async moveFailedToDead(limit = 20) {
        const jobs = await this.failed(limit);
        const dead = [];
        for (const job of jobs) {
            dead.push(await this.mark(job.id, "dead"));
        }
        return {
            success: true,
            deadCount: dead.length,
            dead,
        };
    }
    async cleanupCompleted(limit = 100) {
        const completed = await this.prisma.aiActionLog.findMany({
            where: {
                entityType: "job",
                status: "completed",
            },
            orderBy: {
                createdAt: "asc",
            },
            take: limit,
        });
        for (const job of completed) {
            await this.prisma.aiActionLog.delete({
                where: { id: job.id },
            });
        }
        return {
            success: true,
            deleted: completed.length,
        };
    }
    async dashboard() {
        const jobs = await this.prisma.aiActionLog.findMany({
            where: { entityType: "job" },
            orderBy: { createdAt: "desc" },
        });
        return {
            success: true,
            total: jobs.length,
            queued: jobs.filter((j) => j.status === "queued").length,
            running: jobs.filter((j) => j.status === "running").length,
            completed: jobs.filter((j) => j.status === "completed").length,
            failed: jobs.filter((j) => j.status === "failed").length,
            dead: jobs.filter((j) => j.status === "dead").length,
            byType: this.groupBy(jobs, "action"),
            workerHealth: {
                mode: "in-process",
                status: "active",
                maxBatch: 5,
                autoTickMs: 3000,
            },
            latest: jobs.slice(0, 50),
        };
    }
    priorityOf(job) {
        const action = String(job.action ?? "");
        if (action.includes("URGENT"))
            return 100;
        if (action.includes("PUBLISH"))
            return 80;
        if (action.includes("CAMPAIGN"))
            return 70;
        if (action.includes("ANALYTICS"))
            return 40;
        return 50;
    }
    groupBy(items, key) {
        const map = {};
        for (const item of items) {
            const value = item[key] ?? "unknown";
            map[value] = (map[value] ?? 0) + 1;
        }
        return map;
    }
};
exports.AiJobQueueService = AiJobQueueService;
exports.AiJobQueueService = AiJobQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiJobQueueService);
//# sourceMappingURL=ai-job-queue.service.js.map