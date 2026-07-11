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
var SocialPublicationEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPublicationEventService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_platform_event_service_1 = require("../channel-runtimes/publisher-platform-event.service");
let SocialPublicationEventService = SocialPublicationEventService_1 = class SocialPublicationEventService {
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
        this.logger = new common_1.Logger(SocialPublicationEventService_1.name);
    }
    async createOrRefresh(input) {
        const type = this.eventType(input.channel);
        const existing = await this.prisma.platformEvent.findFirst({
            where: {
                type,
                entityType: "vehicle",
                entityId: input.vehicleId,
                status: {
                    in: [
                        "new",
                        "queued",
                        "pending",
                    ],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const now = new Date();
        if (existing) {
            const updated = await this.prisma.platformEvent.update({
                where: {
                    id: existing.id,
                },
                data: {
                    source: `publisher-engine.${input.channel}`,
                    status: "queued",
                    payload: {
                        ...input.payload,
                        channel: input.channel,
                        vehicleId: input.vehicleId,
                        correlationId: input.correlationId ?? null,
                        refreshedAt: now.toISOString(),
                    },
                    result: {
                        message: `${input.channel} publication request refreshed.`,
                    },
                    updatedAt: now,
                },
            });
            this.logger.log(`Social event refreshed: channel=${input.channel}, vehicleId=${input.vehicleId}, eventId=${updated.id}`);
            return {
                eventId: updated.id,
                operation: "refreshed",
                status: updated.status,
            };
        }
        const created = await this.events.create({
            type,
            source: `publisher-engine.${input.channel}`,
            entityType: "vehicle",
            entityId: input.vehicleId,
            status: "queued",
            payload: {
                ...input.payload,
                channel: input.channel,
                vehicleId: input.vehicleId,
                correlationId: input.correlationId ?? null,
                createdAt: now.toISOString(),
            },
            result: {
                message: `${input.channel} publication queued.`,
            },
        });
        this.logger.log(`Social event created: channel=${input.channel}, vehicleId=${input.vehicleId}, eventId=${created.id}`);
        return {
            eventId: created.id,
            operation: "created",
            status: created.status,
        };
    }
    eventType(channel) {
        switch (channel) {
            case "instagram":
                return "InstagramVehiclePublicationRequested";
            case "tiktok":
                return "TikTokVehiclePublicationRequested";
            case "google_search":
                return "GoogleSearchVehicleCampaignRequested";
            default:
                return "SocialVehiclePublicationRequested";
        }
    }
};
exports.SocialPublicationEventService = SocialPublicationEventService;
exports.SocialPublicationEventService = SocialPublicationEventService = SocialPublicationEventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_platform_event_service_1.PublisherPlatformEventService])
], SocialPublicationEventService);
//# sourceMappingURL=social-publication-event.service.js.map