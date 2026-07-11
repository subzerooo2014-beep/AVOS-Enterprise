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
exports.PublisherRuntimeController = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const publisher_registry_service_1 = require("./publisher-registry.service");
const publisher_dispatcher_service_1 = require("./publisher-dispatcher.service");
let PublisherRuntimeController = class PublisherRuntimeController {
    constructor(prisma, registry, dispatcher) {
        this.prisma = prisma;
        this.registry = registry;
        this.dispatcher = dispatcher;
    }
    channels() {
        return {
            success: true,
            version: "v2",
            count: this.registry.count(),
            channels: this.registry.list(),
            registrations: this.registry.listMetadata(),
            generatedAt: new Date(),
        };
    }
    health() {
        return this.dispatcher.health();
    }
    async publish(body) {
        const title = this.requiredText(body?.title, "title");
        const requestedChannel = this.requiredText(body?.channel ??
            body?.result?.channel ??
            "internal", "channel").toLowerCase();
        const adapter = this.registry.get(requestedChannel);
        const channel = adapter.channel;
        const correlationId = this.optionalText(body?.correlationId) ??
            (0, node_crypto_1.randomUUID)();
        const scheduledAt = body?.scheduledAt
            ? new Date(body.scheduledAt)
            : null;
        if (scheduledAt &&
            Number.isNaN(scheduledAt.getTime())) {
            throw new Error("scheduledAt must be a valid date");
        }
        const inputResult = body?.result &&
            typeof body.result === "object" &&
            !Array.isArray(body.result)
            ? body.result
            : {};
        const result = {
            ...inputResult,
            channel,
            publisher: {
                ...(inputResult.publisher &&
                    typeof inputResult.publisher === "object" &&
                    !Array.isArray(inputResult.publisher)
                    ? inputResult.publisher
                    : {}),
                channel,
            },
            metadata: {
                ...(inputResult.metadata &&
                    typeof inputResult.metadata === "object" &&
                    !Array.isArray(inputResult.metadata)
                    ? inputResult.metadata
                    : {}),
                requestedChannel,
                createdBy: body?.createdBy ??
                    "publisher-engine-api",
            },
        };
        const job = await this.prisma.publishJob.create({
            data: {
                campaignId: this.optionalText(body?.campaignId),
                channelId: this.optionalText(body?.channelId),
                title,
                content: this.optionalText(body?.content),
                status: "queued",
                priority: this.normalizePriority(body?.priority),
                scheduledAt,
                retryCount: 0,
                maxRetries: this.normalizeMaxRetries(body?.maxRetries),
                correlationId,
                result,
            },
        });
        return {
            success: true,
            job,
            createdAt: new Date(),
        };
    }
    async job(id) {
        const job = await this.prisma.publishJob.findUnique({
            where: {
                id: this.requiredText(id, "id"),
            },
        });
        if (!job) {
            throw new Error(`Publisher job "${id}" was not found`);
        }
        return {
            success: true,
            job,
        };
    }
    dispatchOne(id) {
        return this.dispatcher.dispatchOne(this.requiredText(id, "id"));
    }
    dispatchQueued(limit) {
        return this.dispatcher.dispatchQueued(this.normalizeLimit(limit));
    }
    requiredText(value, field) {
        if (typeof value !== "string" ||
            !value.trim()) {
            throw new Error(`${field} must be a non-empty string`);
        }
        return value.trim();
    }
    optionalText(value) {
        if (typeof value !== "string" ||
            !value.trim()) {
            return null;
        }
        return value.trim();
    }
    normalizePriority(value) {
        const priority = String(value ?? "normal")
            .trim()
            .toLowerCase();
        return [
            "low",
            "normal",
            "high",
            "critical",
        ].includes(priority)
            ? priority
            : "normal";
    }
    normalizeMaxRetries(value) {
        const numeric = Number(value);
        if (!Number.isInteger(numeric) ||
            numeric < 0) {
            return 3;
        }
        return Math.min(numeric, 20);
    }
    normalizeLimit(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return 20;
        }
        return Math.min(Math.max(Math.trunc(numeric), 1), 200);
    }
};
exports.PublisherRuntimeController = PublisherRuntimeController;
__decorate([
    (0, common_1.Get)("channels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherRuntimeController.prototype, "channels", null);
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherRuntimeController.prototype, "health", null);
__decorate([
    (0, common_1.Post)("publish"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublisherRuntimeController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)("job/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublisherRuntimeController.prototype, "job", null);
__decorate([
    (0, common_1.Post)("dispatch/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherRuntimeController.prototype, "dispatchOne", null);
__decorate([
    (0, common_1.Post)("dispatch-queued"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherRuntimeController.prototype, "dispatchQueued", null);
exports.PublisherRuntimeController = PublisherRuntimeController = __decorate([
    (0, common_1.Controller)("publisher-engine"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_registry_service_1.PublisherRegistryService,
        publisher_dispatcher_service_1.PublisherDispatcherService])
], PublisherRuntimeController);
//# sourceMappingURL=publisher-runtime.controller.js.map