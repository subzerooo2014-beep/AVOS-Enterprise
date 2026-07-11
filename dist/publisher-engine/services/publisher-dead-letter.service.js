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
var PublisherDeadLetterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherDeadLetterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherDeadLetterService = PublisherDeadLetterService_1 = class PublisherDeadLetterService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PublisherDeadLetterService_1.name);
    }
    async move(job, error) {
        if (!job?.id) {
            throw new Error("Cannot move publisher job to dead letter queue without an id");
        }
        const delegate = this.publishJobDelegate();
        const message = this.errorMessage(error);
        const failedAt = new Date();
        const updated = await delegate.update({
            where: {
                id: job.id,
            },
            data: {
                status: "dead",
                lastError: message.slice(0, 5000),
                failedAt,
                publishedAt: null,
                workerId: null,
                lockToken: null,
                lockedAt: null,
            },
        });
        this.logger.error(`Publisher job moved to dead letter queue: jobId=${job.id}, channel=${this.channelOf(job)}, error=${message}`);
        return {
            success: false,
            status: "dead",
            deadLettered: true,
            job: updated,
            error: {
                message,
            },
            movedAt: failedAt,
        };
    }
    publishJobDelegate() {
        const prisma = this.prisma;
        for (const name of [
            "publishJob",
            "publisherJob",
            "publishingJob",
            "aiPublishJob",
        ]) {
            const delegate = prisma[name];
            if (delegate &&
                typeof delegate.update === "function") {
                return delegate;
            }
        }
        throw new Error("No Prisma publisher job model supports dead letter persistence");
    }
    channelOf(job) {
        return String(job?.channel ??
            job?.result?.channel ??
            job?.metadata?.channel ??
            "unknown");
    }
    errorMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error ??
            "Publisher attempts exhausted");
    }
};
exports.PublisherDeadLetterService = PublisherDeadLetterService;
exports.PublisherDeadLetterService = PublisherDeadLetterService = PublisherDeadLetterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherDeadLetterService);
//# sourceMappingURL=publisher-dead-letter.service.js.map