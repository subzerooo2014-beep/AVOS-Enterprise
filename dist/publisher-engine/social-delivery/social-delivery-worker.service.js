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
var SocialDeliveryWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialDeliveryWorkerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const social_http_delivery_service_1 = require("./social-http-delivery.service");
const external_delivery_service_1 = require("../external-connectors/external-delivery.service");
let SocialDeliveryWorkerService = SocialDeliveryWorkerService_1 = class SocialDeliveryWorkerService {
    constructor(prisma, delivery, externalDelivery) {
        this.prisma = prisma;
        this.delivery = delivery;
        this.externalDelivery = externalDelivery;
        this.logger = new common_1.Logger(SocialDeliveryWorkerService_1.name);
        this.timer = null;
        this.running = false;
        this.processedCount = 0;
        this.deliveredCount = 0;
        this.retryingCount = 0;
        this.deadCount = 0;
        this.awaitingCredentialsCount = 0;
        this.pollIntervalMs = this.positiveInteger(process.env.SOCIAL_DELIVERY_POLL_INTERVAL_MS, 10_000);
        this.batchSize = this.positiveInteger(process.env.SOCIAL_DELIVERY_BATCH_SIZE, 10);
        this.maxAttempts = this.positiveInteger(process.env.SOCIAL_DELIVERY_MAX_ATTEMPTS, 3);
        this.automaticPolling = String(process.env.SOCIAL_DELIVERY_AUTO_START ??
            "true").toLowerCase() !== "false";
    }
    onModuleInit() {
        if (!this.automaticPolling) {
            this.logger.warn("Social Delivery Worker automatic polling is disabled.");
            return;
        }
        this.timer = setInterval(() => {
            void this.runOnce(this.batchSize);
        }, this.pollIntervalMs);
        this.timer.unref?.();
        this.logger.log(`Social Delivery Worker started: intervalMs=${this.pollIntervalMs}, batchSize=${this.batchSize}`);
    }
    onModuleDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    async runOnce(limit = this.batchSize) {
        if (this.running) {
            return {
                success: false,
                skipped: true,
                message: "Social Delivery Worker is already running.",
            };
        }
        this.running = true;
        const startedAt = new Date();
        try {
            const events = await this.prisma.platformEvent.findMany({
                where: {
                    type: {
                        in: [
                            "InstagramVehiclePublicationRequested",
                            "TikTokVehiclePublicationRequested",
                            "GoogleSearchVehicleCampaignRequested",
                        ],
                    },
                    status: {
                        in: [
                            "queued",
                            "retrying",
                        ],
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
                take: this.normalizeLimit(limit),
            });
            const results = [];
            for (const event of events) {
                results.push(await this.processEvent(event));
            }
            const finishedAt = new Date();
            return {
                success: true,
                selected: events.length,
                results,
                startedAt,
                finishedAt,
                durationMs: finishedAt.getTime() -
                    startedAt.getTime(),
            };
        }
        finally {
            this.running = false;
        }
    }
    async processById(eventId) {
        const event = await this.prisma.platformEvent.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!event) {
            throw new Error(`PlatformEvent "${eventId}" was not found.`);
        }
        return this.processEvent(event);
    }
    status() {
        return {
            success: true,
            worker: "SocialDeliveryWorkerV1",
            running: this.running,
            automaticPolling: this.automaticPolling,
            pollIntervalMs: this.pollIntervalMs,
            batchSize: this.batchSize,
            maxAttempts: this.maxAttempts,
            counters: {
                processed: this.processedCount,
                delivered: this.deliveredCount,
                retrying: this.retryingCount,
                dead: this.deadCount,
                awaitingCredentials: this.awaitingCredentialsCount,
            },
            providers: this.externalDelivery.providers(),
        };
    }
    credentialsReadiness() {
        const providers = this.externalDelivery.providers();
        return {
            success: true,
            ready: providers.every((provider) => provider.configured),
            configuredCount: providers.filter((provider) => provider.configured).length,
            totalProviders: providers.length,
            providers,
            checkedAt: new Date(),
        };
    }
    async requeueAwaitingCredentials(channel) {
        const supportedChannels = [
            "instagram",
            "tiktok",
            "google_search",
        ];
        const normalizedChannel = channel?.trim().toLowerCase();
        if (normalizedChannel &&
            !supportedChannels.includes(normalizedChannel)) {
            throw new Error(`Unsupported social channel "${normalizedChannel}".`);
        }
        const providerStates = this.externalDelivery.providers();
        const configuredChannels = providerStates
            .filter((provider) => provider.configured)
            .map((provider) => provider.channel);
        const selectedChannels = normalizedChannel
            ? configuredChannels.filter((item) => item === normalizedChannel)
            : configuredChannels;
        if (selectedChannels.length === 0) {
            return {
                success: false,
                requeued: 0,
                message: normalizedChannel
                    ? `${normalizedChannel} is not configured.`
                    : "No configured social providers are available.",
                configuredChannels,
            };
        }
        const eventTypes = selectedChannels.map((item) => this.eventTypeFromChannel(item));
        const candidates = await this.prisma.platformEvent.findMany({
            where: {
                status: "awaiting_credentials",
                type: {
                    in: eventTypes,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        let requeued = 0;
        for (const event of candidates) {
            const result = this.objectOf(event.result);
            const delivery = this.objectOf(result.delivery);
            await this.prisma.platformEvent.update({
                where: {
                    id: event.id,
                },
                data: {
                    status: "queued",
                    result: {
                        ...result,
                        delivery: {
                            ...delivery,
                            status: "queued",
                            requeuedAt: new Date().toISOString(),
                            reason: "Provider credentials became available.",
                        },
                    },
                    updatedAt: new Date(),
                },
            });
            requeued += 1;
        }
        return {
            success: true,
            requeued,
            channels: selectedChannels,
            eventTypes,
            requeuedAt: new Date(),
        };
    }
    async requeueAndRun(channel, limit = this.batchSize) {
        const requeue = await this.requeueAwaitingCredentials(channel);
        if (!requeue.success ||
            requeue.requeued === 0) {
            return {
                success: requeue.success,
                requeue,
                dispatch: null,
            };
        }
        const dispatch = await this.runOnce(limit);
        return {
            success: true,
            requeue,
            dispatch,
        };
    }
    async queue(limit = 50) {
        return this.prisma.platformEvent.findMany({
            where: {
                type: {
                    in: [
                        "InstagramVehiclePublicationRequested",
                        "TikTokVehiclePublicationRequested",
                        "GoogleSearchVehicleCampaignRequested",
                    ],
                },
                status: {
                    in: [
                        "queued",
                        "processing",
                        "retrying",
                        "awaiting_credentials",
                        "dead",
                    ],
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: this.normalizeLimit(limit),
        });
    }
    async processEvent(event) {
        const channel = this.channelFromEvent(event);
        if (!channel) {
            return {
                success: false,
                eventId: event.id,
                status: "skipped",
                message: "Unsupported social delivery event type.",
            };
        }
        const previousResult = this.objectOf(event.result);
        const previousDelivery = this.objectOf(previousResult.delivery);
        const attempt = Number(previousDelivery.attempt ?? 0) + 1;
        const startedAt = new Date();
        await this.updateEvent(event.id, "processing", {
            ...previousResult,
            delivery: {
                ...previousDelivery,
                channel,
                attempt,
                status: "processing",
                startedAt: startedAt.toISOString(),
                completedAt: null,
            },
        });
        const deliveryResult = await this.delivery.deliver({
            channel,
            eventId: event.id,
            payload: event.payload,
            attempt,
        });
        const completedAt = deliveryResult.completedAt ??
            new Date();
        const durationMs = Math.max(0, completedAt.getTime() -
            startedAt.getTime());
        this.processedCount += 1;
        const finalDeliveryBase = {
            ...previousDelivery,
            ...deliveryResult,
            channel,
            attempt,
            startedAt: startedAt.toISOString(),
            completedAt: completedAt.toISOString(),
            durationMs,
        };
        if (deliveryResult.status ===
            "awaiting_credentials") {
            this.awaitingCredentialsCount += 1;
            await this.updateEvent(event.id, "awaiting_credentials", {
                ...previousResult,
                delivery: {
                    ...finalDeliveryBase,
                    status: "awaiting_credentials",
                },
            });
            return {
                ...deliveryResult,
                startedAt,
                completedAt,
                durationMs,
            };
        }
        if (deliveryResult.success) {
            this.deliveredCount += 1;
            await this.updateEvent(event.id, "delivered", {
                ...previousResult,
                delivery: {
                    ...finalDeliveryBase,
                    status: "delivered",
                    success: true,
                },
            });
            return {
                ...deliveryResult,
                startedAt,
                completedAt,
                durationMs,
            };
        }
        const terminal = attempt >= this.maxAttempts;
        const status = terminal
            ? "dead"
            : "retrying";
        if (terminal) {
            this.deadCount += 1;
        }
        else {
            this.retryingCount += 1;
        }
        await this.updateEvent(event.id, status, {
            ...previousResult,
            delivery: {
                ...finalDeliveryBase,
                status,
                terminal,
                success: false,
            },
        });
        return {
            ...deliveryResult,
            status,
            terminal,
            startedAt,
            completedAt,
            durationMs,
        };
    }
    async updateEvent(id, status, result) {
        await this.prisma.platformEvent.update({
            where: {
                id,
            },
            data: {
                status,
                result,
                updatedAt: new Date(),
            },
        });
    }
    eventTypeFromChannel(channel) {
        switch (channel) {
            case "instagram":
                return "InstagramVehiclePublicationRequested";
            case "tiktok":
                return "TikTokVehiclePublicationRequested";
            case "google_search":
                return "GoogleSearchVehicleCampaignRequested";
            default:
                throw new Error(`Unsupported social channel "${channel}".`);
        }
    }
    channelFromEvent(event) {
        switch (event?.type) {
            case "InstagramVehiclePublicationRequested":
                return "instagram";
            case "TikTokVehiclePublicationRequested":
                return "tiktok";
            case "GoogleSearchVehicleCampaignRequested":
                return "google_search";
            default:
                return null;
        }
    }
    objectOf(value) {
        if (value &&
            typeof value === "object" &&
            !Array.isArray(value)) {
            return value;
        }
        return {};
    }
    normalizeLimit(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return this.batchSize;
        }
        return Math.min(100, Math.max(1, Math.trunc(numeric)));
    }
    positiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
};
exports.SocialDeliveryWorkerService = SocialDeliveryWorkerService;
exports.SocialDeliveryWorkerService = SocialDeliveryWorkerService = SocialDeliveryWorkerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        social_http_delivery_service_1.SocialHttpDeliveryService,
        external_delivery_service_1.ExternalDeliveryService])
], SocialDeliveryWorkerService);
//# sourceMappingURL=social-delivery-worker.service.js.map