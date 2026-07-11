"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiJobQueueModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_job_queue_controller_1 = require("./ai-job-queue.controller");
const ai_job_queue_service_1 = require("./ai-job-queue.service");
const ai_job_worker_service_1 = require("./ai-job-worker.service");
let AiJobQueueModule = class AiJobQueueModule {
};
exports.AiJobQueueModule = AiJobQueueModule;
exports.AiJobQueueModule = AiJobQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [
            ai_job_queue_controller_1.AiJobQueueController,
        ],
        providers: [
            ai_job_queue_service_1.AiJobQueueService,
            ai_job_worker_service_1.AiJobWorkerService,
        ],
        exports: [
            ai_job_queue_service_1.AiJobQueueService,
        ],
    })
], AiJobQueueModule);
//# sourceMappingURL=ai-job-queue.module.js.map