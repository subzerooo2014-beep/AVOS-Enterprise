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
var PublishJobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishJobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const publisher_dispatcher_service_1 = require("../publisher-engine/publisher-dispatcher.service");
const publisher_registry_service_1 = require("../publisher-engine/publisher-registry.service");
let PublishJobsService = PublishJobsService_1 = class PublishJobsService {
    constructor(prisma, dispatcher, registry) {
        this.prisma = prisma;
        this.dispatcher = dispatcher;
        this.registry = registry;
        this.logger = new common_1.Logger(PublishJobsService_1.name);
    }
    async create(vehicleId) {
        return this.createChannelJob(vehicleId, "internal", "Publish vehicle listing", "queued");
    }
    async createChannelJob(vehicleId, channel, title, status = "queued", content, extra) {
        const normalizedVehicleId = this.requiredText(vehicleId, "vehicleId");
        const requestedChannel = this.requiredText(channel, "channel").toLowerCase();
        const adapter = this.registry.get(requestedChannel);
        const canonicalChannel = adapter.channel;
        const normalizedStatus = this.normalizeStatus(status);
        const existing = await this.findActiveDuplicate(normalizedVehicleId, canonicalChannel);
        if (existing) {
            this.logger.warn(`Active publisher job already exists: vehicleId=${normalizedVehicleId}, channel=${canonicalChannel}, jobId=${existing.id}`);
            return {
                ...existing,
                duplicatePrevented: true,
            };
        }
        const sourceMetadata = extra?.metadata &&
            typeof extra.metadata === "object" &&
            !Array.isArray(extra.metadata)
            ? extra.metadata
            : {};
        const job = await this.prisma.publishJob.create({
            data: {
                title: this.requiredText(title, "title"),
                content: content?.trim() ||
                    `vehicle:${normalizedVehicleId}`,
                status: normalizedStatus,
                priority: this.normalizePriority(extra?.priority),
                correlationId: typeof extra?.correlationId === "string" &&
                    extra.correlationId.trim()
                    ? extra.correlationId.trim()
                    : null,
                maxRetries: this.normalizeMaxRetries(extra?.maxRetries),
                result: {
                    ...(extra &&
                        typeof extra === "object" &&
                        !Array.isArray(extra)
                        ? extra
                        : {}),
                    entityType: "vehicle",
                    entityId: normalizedVehicleId,
                    vehicleId: normalizedVehicleId,
                    channel: canonicalChannel,
                    source: "ai-publishing-pipeline",
                    publisher: {
                        ...(extra?.publisher &&
                            typeof extra.publisher === "object" &&
                            !Array.isArray(extra.publisher)
                            ? extra.publisher
                            : {}),
                        channel: canonicalChannel,
                    },
                    metadata: {
                        ...sourceMetadata,
                        vehicleId: normalizedVehicleId,
                        requestedChannel,
                        canonicalChannel,
                        createdBy: sourceMetadata.createdBy ??
                            "ai-publishing-pipeline",
                    },
                },
            },
        });
        this.logger.log(`Publisher job created: jobId=${job.id}, vehicleId=${normalizedVehicleId}, channel=${canonicalChannel}, status=${normalizedStatus}`);
        if (normalizedStatus === "queued") {
            this.dispatchInBackground(job.id);
        }
        return job;
    }
    async forVehicle(vehicleId) {
        const normalizedVehicleId = this.requiredText(vehicleId, "vehicleId");
        return this.prisma.publishJob.findMany({
            where: {
                OR: [
                    {
                        content: {
                            contains: normalizedVehicleId,
                        },
                    },
                    {
                        result: {
                            path: "$.vehicleId",
                            equals: normalizedVehicleId,
                        },
                    },
                    {
                        result: {
                            path: "$.entityId",
                            equals: normalizedVehicleId,
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async all() {
        return this.prisma.publishJob.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findActiveDuplicate(vehicleId, channel) {
        try {
            return await this.prisma.publishJob.findFirst({
                where: {
                    status: {
                        in: [
                            "queued",
                            "retrying",
                            "locked",
                            "processing",
                        ],
                    },
                    AND: [
                        {
                            result: {
                                path: ["vehicleId"],
                                equals: vehicleId,
                            },
                        },
                        {
                            result: {
                                path: ["channel"],
                                equals: channel,
                            },
                        },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        catch (error) {
            this.logger.warn(`Publisher duplicate query fallback used: ${this.errorMessage(error)}`);
            const candidates = await this.prisma.publishJob.findMany({
                where: {
                    status: {
                        in: [
                            "queued",
                            "retrying",
                            "locked",
                            "processing",
                        ],
                    },
                    content: {
                        contains: vehicleId,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 20,
            });
            return (candidates.find((job) => job?.result?.channel === channel &&
                (job?.result?.vehicleId === vehicleId ||
                    job?.result?.entityId === vehicleId)) ?? null);
        }
    }
    dispatchInBackground(jobId) {
        setImmediate(() => {
            void this.dispatcher
                .dispatchOne(jobId)
                .then((result) => {
                this.logger.log(`Publisher job dispatched automatically: jobId=${jobId}, status=${String(result?.status ?? "unknown")}`);
            })
                .catch((error) => {
                this.logger.error(`Automatic publisher dispatch failed: jobId=${jobId}, error=${this.errorMessage(error)}`, error instanceof Error
                    ? error.stack
                    : undefined);
            });
        });
    }
    normalizeStatus(value) {
        const status = String(value ?? "queued")
            .trim()
            .toLowerCase();
        return [
            "queued",
            "retrying",
            "skipped",
        ].includes(status)
            ? status
            : "queued";
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
    requiredText(value, field) {
        if (typeof value !== "string" ||
            !value.trim()) {
            throw new Error(`${field} must be a non-empty string`);
        }
        return value.trim();
    }
    errorMessage(error) {
        return error instanceof Error
            ? error.message
            : String(error ?? "Unknown publish job error");
    }
};
exports.PublishJobsService = PublishJobsService;
exports.PublishJobsService = PublishJobsService = PublishJobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_dispatcher_service_1.PublisherDispatcherService,
        publisher_registry_service_1.PublisherRegistryService])
], PublishJobsService);
//# sourceMappingURL=publish-jobs.service.js.map