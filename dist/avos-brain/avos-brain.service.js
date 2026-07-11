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
exports.AvosBrainService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_runtime_service_1 = require("../ai-runtime/ai-runtime.service");
let AvosBrainService = class AvosBrainService {
    constructor(prisma, aiRuntime) {
        this.prisma = prisma;
        this.aiRuntime = aiRuntime;
    }
    async processTask(task) {
        try {
            const result = await this.aiRuntime.run(task.taskType, task.input || {});
            return this.prisma.brainTask.update({
                where: { id: task.id },
                data: {
                    status: result.status === "success" ? "completed" : "failed",
                    output: {
                        agentStatus: result.status,
                        confidence: result.confidence || 0,
                        reason: result.reason,
                        result: result.output,
                        processedAt: new Date().toISOString(),
                    },
                },
            });
        }
        catch (error) {
            return this.prisma.brainTask.update({
                where: { id: task.id },
                data: {
                    status: "failed",
                    output: {
                        error: error instanceof Error ? error.message : String(error),
                        failedAt: new Date().toISOString(),
                    },
                },
            });
        }
    }
    async processQueued(limit = 20) {
        const tasks = await this.prisma.brainTask.findMany({
            where: { status: "queued" },
            orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
            take: Number(limit),
        });
        const results = [];
        for (const task of tasks) {
            results.push(await this.processTask(task));
        }
        return {
            processed: results.length,
            results,
        };
    }
    async processEvent(eventId) {
        const event = await this.prisma.platformEvent.findUnique({
            where: { id: eventId },
        });
        if (!event)
            throw new common_1.NotFoundException("Platform event not found");
        return this.processQueued(20);
    }
    async processLatest(limit = 10) {
        return this.processQueued(limit);
    }
    listTasks(status) {
        return this.prisma.brainTask.findMany({
            where: status ? { status } : {},
            orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
        });
    }
    async completeTask(id, output = {}) {
        const task = await this.prisma.brainTask.findUnique({
            where: { id },
        });
        if (!task)
            throw new common_1.NotFoundException("Brain task not found");
        return this.prisma.brainTask.update({
            where: { id },
            data: {
                status: "completed",
                output: {
                    ...(task.output || {}),
                    ...output,
                    completedAt: new Date().toISOString(),
                },
            },
        });
    }
};
exports.AvosBrainService = AvosBrainService;
exports.AvosBrainService = AvosBrainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_runtime_service_1.AiRuntimeService])
], AvosBrainService);
//# sourceMappingURL=avos-brain.service.js.map