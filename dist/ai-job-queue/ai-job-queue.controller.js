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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiJobQueueController = void 0;
const common_1 = require("@nestjs/common");
const ai_job_queue_service_1 = require("./ai-job-queue.service");
const ai_job_worker_service_1 = require("./ai-job-worker.service");
let AiJobQueueController = class AiJobQueueController {
    constructor(service, worker) {
        this.service = service;
        this.worker = worker;
    }
    enqueue(body) {
        return this.service.enqueue(body.type ?? "AI_JOB", body.payload ?? {}, body.priority ?? 50);
    }
    queued(limit) {
        return this.service.queued(limit ? Number(limit) : 20);
    }
    dashboard() {
        return this.service.dashboard();
    }
    process(limit) {
        return this.worker.processBatch(limit ? Number(limit) : 5);
    }
    retryFailed(limit) {
        return this.service.retryFailed(limit ? Number(limit) : 20);
    }
    deadLetter(limit) {
        return this.service.moveFailedToDead(limit ? Number(limit) : 20);
    }
    cleanup(limit) {
        return this.service.cleanupCompleted(limit ? Number(limit) : 100);
    }
};
exports.AiJobQueueController = AiJobQueueController;
__decorate([
    (0, common_1.Post)("enqueue"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "enqueue", null);
__decorate([
    (0, common_1.Get)("queued"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "queued", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Post)("process"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "process", null);
__decorate([
    (0, common_1.Post)("retry-failed"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "retryFailed", null);
__decorate([
    (0, common_1.Post)("dead-letter"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "deadLetter", null);
__decorate([
    (0, common_1.Delete)("cleanup-completed"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiJobQueueController.prototype, "cleanup", null);
exports.AiJobQueueController = AiJobQueueController = __decorate([
    (0, common_1.Controller)("ai-job-queue"),
    __metadata("design:paramtypes", [ai_job_queue_service_1.AiJobQueueService,
        ai_job_worker_service_1.AiJobWorkerService])
], AiJobQueueController);
//# sourceMappingURL=ai-job-queue.controller.js.map