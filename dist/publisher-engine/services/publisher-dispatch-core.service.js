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
exports.PublisherDispatchCoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_registry_service_1 = require("../publisher-registry.service");
const publisher_context_builder_service_1 = require("./publisher-context-builder.service");
const publisher_result_normalizer_service_1 = require("./publisher-result-normalizer.service");
const publisher_time_util_1 = require("../utils/publisher-time.util");
let PublisherDispatchCoreService = class PublisherDispatchCoreService {
    constructor(prisma, registry, contextBuilder, normalizer) {
        this.prisma = prisma;
        this.registry = registry;
        this.contextBuilder = contextBuilder;
        this.normalizer = normalizer;
    }
    async dispatchOne(job) {
        this.validateReservedJob(job);
        const startedAt = new Date();
        const context = this.contextBuilder.build(job);
        const adapter = this.registry.get(context.channel);
        const rawResult = await adapter.publish(context);
        const result = this.normalizer.normalize(context.channel, rawResult);
        if (result.status !== "published" &&
            result.status !== "skipped") {
            throw new Error(result.message ||
                `Publisher "${context.channel}" returned status "${result.status}"`);
        }
        const completedAt = new Date();
        const durationMs = (0, publisher_time_util_1.diffMs)(startedAt);
        const savedJob = await this.prisma.$transaction(async (transaction) => {
            const ownershipWhere = {
                id: job.id,
            };
            if (job.lockToken) {
                ownershipWhere.lockToken = job.lockToken;
            }
            if (job.workerId) {
                ownershipWhere.workerId = job.workerId;
            }
            const updated = await transaction.publishJob.updateMany({
                where: ownershipWhere,
                data: {
                    status: result.status === "skipped"
                        ? "skipped"
                        : "published",
                    result: {
                        ...result,
                        durationMs,
                        completedAt: completedAt.toISOString(),
                    },
                    publishedAt: result.status === "published"
                        ? completedAt
                        : null,
                    failedAt: null,
                    lastError: null,
                    workerId: null,
                    lockToken: null,
                    lockedAt: null,
                },
            });
            if (updated.count !== 1) {
                throw new Error(`Publisher job "${job.id}" ownership was lost before completion`);
            }
            return transaction.publishJob.findUnique({
                where: {
                    id: job.id,
                },
            });
        }, {
            timeout: 30_000,
        });
        return {
            success: true,
            status: result.status,
            channel: context.channel,
            jobId: job.id,
            result,
            job: savedJob,
            durationMs,
            completedAt,
        };
    }
    validateReservedJob(job) {
        if (!job || typeof job !== "object") {
            throw new Error("Publisher job is required");
        }
        if (typeof job.id !== "string" || !job.id.trim()) {
            throw new Error("Publisher job id is required");
        }
        if (typeof job.workerId !== "string" ||
            !job.workerId.trim()) {
            throw new Error(`Publisher job "${job.id}" has no worker reservation`);
        }
        if (typeof job.lockToken !== "string" ||
            !job.lockToken.trim()) {
            throw new Error(`Publisher job "${job.id}" has no lock token`);
        }
        if (!job.lockedAt) {
            throw new Error(`Publisher job "${job.id}" has no lock timestamp`);
        }
    }
};
exports.PublisherDispatchCoreService = PublisherDispatchCoreService;
exports.PublisherDispatchCoreService = PublisherDispatchCoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_registry_service_1.PublisherRegistryService,
        publisher_context_builder_service_1.PublisherContextBuilderService,
        publisher_result_normalizer_service_1.PublisherResultNormalizerService])
], PublisherDispatchCoreService);
//# sourceMappingURL=publisher-dispatch-core.service.js.map