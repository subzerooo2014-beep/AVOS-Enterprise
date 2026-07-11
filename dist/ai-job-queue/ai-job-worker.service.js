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
var AiJobWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiJobWorkerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const ai_job_queue_service_1 = require("./ai-job-queue.service");
let AiJobWorkerService = AiJobWorkerService_1 = class AiJobWorkerService {
    constructor(queue) {
        this.queue = queue;
        this.logger = new common_1.Logger(AiJobWorkerService_1.name);
        this.working = false;
    }
    async tick() {
        if (this.working)
            return;
        this.working = true;
        try {
            await this.processBatch(5);
        }
        finally {
            this.working = false;
        }
    }
    async processBatch(limit = 5) {
        const jobs = await this.queue.queued(limit);
        const processed = [];
        for (const job of jobs) {
            await this.queue.mark(job.id, "running");
            try {
                await this.execute(job);
                processed.push(await this.queue.mark(job.id, "completed"));
            }
            catch (e) {
                processed.push(await this.queue.mark(job.id, "failed"));
            }
        }
        return {
            success: true,
            processedCount: processed.length,
            processed,
        };
    }
    async execute(job) {
        this.logger.log(`Executing job ${job.action}`);
        if (String(job.action).includes("FAIL_TEST")) {
            throw new Error("Simulated job failure");
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
};
exports.AiJobWorkerService = AiJobWorkerService;
__decorate([
    (0, schedule_1.Interval)(3000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiJobWorkerService.prototype, "tick", null);
exports.AiJobWorkerService = AiJobWorkerService = AiJobWorkerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_job_queue_service_1.AiJobQueueService])
], AiJobWorkerService);
//# sourceMappingURL=ai-job-worker.service.js.map