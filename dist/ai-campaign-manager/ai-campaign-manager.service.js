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
exports.AiCampaignManagerService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let AiCampaignManagerService = class AiCampaignManagerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePlan(vehicleId, input = {}) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: {
                id: vehicleId,
            },
            include: {
                inventory: true,
                dealer: true,
                showroom: true,
                brand: true,
                vehicleModel: true,
                trim: true,
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException("Vehicle not found.");
        }
        const country = this.text(input.country, "AE").toUpperCase();
        const language = this.text(input.language, "en").toLowerCase();
        const durationDays = this.integer(input.durationDays, 14, 1, 90);
        const totalBudget = input.organicOnly
            ? 0
            : this.money(input.totalBudget, 1500);
        const objective = this.text(input.objective, "vehicle_leads");
        const price = Number(vehicle.inventory?.price ??
            0);
        const completeness = this.completeness(vehicle);
        const selectedChannels = this.selectChannels({
            vehicle,
            price,
            country,
            organicOnly: input.organicOnly === true,
            preferredChannels: input.preferredChannels,
        });
        const channelPlans = this.channelPlans({
            channels: selectedChannels,
            totalBudget,
            durationDays,
            price,
            vehicle,
        });
        const audience = this.audience({
            vehicle,
            country,
            price,
        });
        const schedule = this.schedule(selectedChannels, durationDays);
        const confidence = this.confidence({
            completeness,
            channelCount: selectedChannels.length,
            price,
        });
        const planId = (0, node_crypto_1.randomUUID)();
        const generatedAt = new Date();
        const plan = {
            planId,
            version: 1,
            status: "draft",
            vehicleId: vehicle.id,
            objective,
            country,
            language,
            durationDays,
            totalBudget,
            vehicleSnapshot: {
                id: vehicle.id,
                vin: vehicle.vin,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                status: vehicle.status,
                location: vehicle.location,
                price,
                dealerId: vehicle.dealerId,
                showroomId: vehicle.showroomId,
            },
            selectedChannels,
            channelPlans,
            audience,
            schedule,
            creativeBrief: {
                headline: `${vehicle.year} ${vehicle.make} ${vehicle.model} available in ${country}`,
                keyMessages: [
                    `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    price > 0
                        ? `Price ${price}`
                        : "Contact for price",
                    vehicle.color
                        ? `Color ${vehicle.color}`
                        : null,
                    "Available through AVOS",
                ].filter(Boolean),
                callToAction: price > 0
                    ? "View vehicle"
                    : "Request details",
                language,
            },
            intelligence: {
                completenessScore: completeness,
                confidence,
                recommendation: this.recommendation({
                    completeness,
                    price,
                    channelCount: selectedChannels.length,
                }),
                risks: this.risks({
                    vehicle,
                    price,
                    completeness,
                }),
            },
            generatedAt,
        };
        return {
            success: true,
            plan,
        };
    }
    async generateAndSave(vehicleId, input = {}) {
        const generated = await this.generatePlan(vehicleId, input);
        const plan = generated.plan;
        const now = new Date();
        const event = await this.prisma.platformEvent.create({
            data: {
                id: (0, node_crypto_1.randomUUID)(),
                type: "AiCampaignPlanGenerated",
                source: "ai-campaign-manager",
                entityType: "vehicle",
                entityId: vehicleId,
                status: "draft",
                payload: {
                    plan,
                },
                result: {
                    message: "AI campaign plan generated successfully.",
                    planId: plan.planId,
                    confidence: plan.intelligence.confidence,
                    selectedChannels: plan.selectedChannels,
                },
                updatedAt: now,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: "AI_CAMPAIGN_PLAN_GENERATED",
                entity: "PlatformEvent",
                entityId: event.id,
            },
        });
        return {
            success: true,
            eventId: event.id,
            plan,
            savedAt: now,
        };
    }
    async history(vehicleId, limit = 20) {
        const events = await this.prisma.platformEvent.findMany({
            where: {
                type: "AiCampaignPlanGenerated",
                entityType: "vehicle",
                entityId: vehicleId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: Math.min(100, Math.max(1, Number(limit) || 20)),
        });
        return {
            success: true,
            vehicleId,
            count: events.length,
            plans: events.map((event) => ({
                eventId: event.id,
                status: event.status,
                plan: event.payload?.plan ??
                    null,
                result: event.result,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
            })),
        };
    }
    async submitForApproval(eventId, note) {
        const event = await this.campaignEvent(eventId);
        if (event.status !== "draft") {
            throw new common_1.BadRequestException(`Campaign plan cannot be submitted from status "${event.status}".`);
        }
        return this.changeStatus({
            event,
            nextStatus: "pending_approval",
            action: "AI_CAMPAIGN_SUBMITTED_FOR_APPROVAL",
            note: note ??
                "Campaign plan submitted for approval.",
        });
    }
    async approve(eventId, input) {
        const event = await this.campaignEvent(eventId);
        if (![
            "draft",
            "pending_approval",
        ].includes(event.status)) {
            throw new common_1.BadRequestException(`Campaign plan cannot be approved from status "${event.status}".`);
        }
        return this.changeStatus({
            event,
            nextStatus: "approved",
            action: "AI_CAMPAIGN_APPROVED",
            actor: input?.approvedBy,
            note: input?.note ??
                "Campaign plan approved.",
        });
    }
    async reject(eventId, input) {
        const event = await this.campaignEvent(eventId);
        if (![
            "draft",
            "pending_approval",
        ].includes(event.status)) {
            throw new common_1.BadRequestException(`Campaign plan cannot be rejected from status "${event.status}".`);
        }
        return this.changeStatus({
            event,
            nextStatus: "rejected",
            action: "AI_CAMPAIGN_REJECTED",
            actor: input?.rejectedBy,
            note: input?.reason ??
                "Campaign plan rejected.",
        });
    }
    async cancel(eventId, input) {
        const event = await this.campaignEvent(eventId);
        if ([
            "cancelled",
            "rejected",
        ].includes(event.status)) {
            throw new common_1.BadRequestException(`Campaign plan is already "${event.status}".`);
        }
        return this.changeStatus({
            event,
            nextStatus: "cancelled",
            action: "AI_CAMPAIGN_CANCELLED",
            actor: input?.cancelledBy,
            note: input?.reason ??
                "Campaign plan cancelled.",
        });
    }
    async plan(eventId) {
        const event = await this.campaignEvent(eventId);
        const payload = this.objectOf(event.payload);
        const result = this.objectOf(event.result);
        return {
            success: true,
            eventId: event.id,
            status: event.status,
            plan: payload.plan ??
                null,
            lifecycle: Array.isArray(result.lifecycle)
                ? result.lifecycle
                : [],
            latestDecision: result.latestDecision ??
                null,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    }
    async lifecycle(eventId) {
        const event = await this.campaignEvent(eventId);
        const result = this.objectOf(event.result);
        const lifecycle = Array.isArray(result.lifecycle)
            ? result.lifecycle
            : [];
        return {
            success: true,
            eventId: event.id,
            status: event.status,
            count: lifecycle.length,
            lifecycle,
        };
    }
    async campaignEvent(eventId) {
        const normalized = String(eventId)
            .trim();
        if (!normalized) {
            throw new common_1.BadRequestException("eventId is required.");
        }
        const event = await this.prisma.platformEvent.findUnique({
            where: {
                id: normalized,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("AI campaign plan was not found.");
        }
        if (event.type !==
            "AiCampaignPlanGenerated") {
            throw new common_1.BadRequestException("PlatformEvent is not an AI campaign plan.");
        }
        return event;
    }
    async changeStatus(input) {
        const now = new Date();
        const result = this.objectOf(input.event.result);
        const lifecycle = Array.isArray(result.lifecycle)
            ? result.lifecycle
            : [];
        const record = {
            id: (0, node_crypto_1.randomUUID)(),
            fromStatus: input.event.status,
            toStatus: input.nextStatus,
            action: input.action,
            actor: this.text(input.actor, "system"),
            note: this.text(input.note, "No note provided."),
            at: now.toISOString(),
        };
        const updated = await this.prisma.platformEvent.update({
            where: {
                id: input.event.id,
            },
            data: {
                status: input.nextStatus,
                result: {
                    ...result,
                    lifecycle: [
                        ...lifecycle,
                        record,
                    ],
                    latestDecision: record,
                },
                updatedAt: now,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: input.action,
                entity: "PlatformEvent",
                entityId: input.event.id,
            },
        });
        return {
            success: true,
            eventId: updated.id,
            previousStatus: input.event.status,
            status: updated.status,
            decision: record,
            updatedAt: updated.updatedAt,
        };
    }
    objectOf(value) {
        if (value &&
            typeof value === "object" &&
            !Array.isArray(value)) {
            return value;
        }
        return {};
    }
    selectChannels(input) {
        const supported = [
            "website",
            "instagram",
            "tiktok",
            "google_search",
            "crm_leads",
            "matched_buyers",
            "dealer_network",
            "gcc_export",
        ];
        const preferred = Array.isArray(input.preferredChannels)
            ? input.preferredChannels
                .map((item) => String(item)
                .trim()
                .toLowerCase())
                .filter((item) => supported.includes(item))
            : [];
        if (preferred.length > 0) {
            return Array.from(new Set(preferred));
        }
        const channels = [
            "website",
            "crm_leads",
            "matched_buyers",
        ];
        if (input.vehicle.color ||
            input.vehicle.year >= 2020) {
            channels.push("instagram");
        }
        if (input.vehicle.year >= 2022) {
            channels.push("tiktok");
        }
        if (!input.organicOnly &&
            input.price > 0) {
            channels.push("google_search");
        }
        if (input.price >= 100000) {
            channels.push("dealer_network");
        }
        if (input.country === "AE") {
            channels.push("gcc_export");
        }
        return Array.from(new Set(channels));
    }
    channelPlans(input) {
        const paidWeights = {
            google_search: 0.45,
            instagram: 0.35,
            tiktok: 0.2,
        };
        const paidChannels = input.channels.filter((channel) => paidWeights[channel]);
        const totalWeight = paidChannels.reduce((sum, channel) => sum +
            Number(paidWeights[channel] ??
                0), 0);
        return input.channels.map((channel) => {
            const weight = Number(paidWeights[channel] ??
                0);
            const budget = totalWeight > 0 &&
                weight > 0
                ? Number((input.totalBudget *
                    weight /
                    totalWeight).toFixed(2))
                : 0;
            return {
                channel,
                mode: budget > 0
                    ? "paid"
                    : "organic",
                budget,
                dailyBudget: budget > 0
                    ? Number((budget /
                        input.durationDays).toFixed(2))
                    : 0,
                priority: channel ===
                    "google_search"
                    ? "high"
                    : channel ===
                        "website"
                        ? "high"
                        : "normal",
                objective: channel ===
                    "google_search"
                    ? "high_intent_leads"
                    : channel ===
                        "crm_leads"
                        ? "lead_reactivation"
                        : "vehicle_awareness",
                expectedAction: channel ===
                    "dealer_network"
                    ? "dealer_distribution"
                    : channel ===
                        "matched_buyers"
                        ? "buyer_matching"
                        : "publish",
            };
        });
    }
    audience(input) {
        const priceSegment = input.price >= 250000
            ? "luxury"
            : input.price >= 100000
                ? "premium"
                : input.price > 0
                    ? "mass_market"
                    : "unknown";
        return {
            country: input.country,
            segments: [
                `${input.vehicle.make} buyers`,
                `${input.vehicle.model} buyers`,
                `${input.vehicle.year} vehicle buyers`,
                `${priceSegment} vehicle shoppers`,
            ],
            intentSignals: [
                "vehicle_search",
                "price_comparison",
                "dealer_visit",
                "finance_interest",
            ],
            priceSegment,
            excludedAudiences: [
                "existing_vehicle_owner_same_vin",
                "fraud_high_risk",
            ],
        };
    }
    schedule(channels, durationDays) {
        const start = new Date();
        return channels.map((channel, index) => ({
            channel,
            scheduledAt: new Date(start.getTime() +
                index *
                    15 *
                    60 *
                    1000),
            durationDays,
            timezone: "Asia/Dubai",
            strategy: channel === "google_search"
                ? "always_on"
                : channel === "tiktok" ||
                    channel === "instagram"
                    ? "peak_engagement"
                    : "immediate",
        }));
    }
    completeness(vehicle) {
        const checks = [
            Boolean(vehicle.vin),
            Boolean(vehicle.make),
            Boolean(vehicle.model),
            Boolean(vehicle.year),
            Boolean(vehicle.color),
            Boolean(vehicle.status),
            Boolean(vehicle.inventory?.price),
            Boolean(vehicle.location ||
                vehicle.inventory?.location),
            Boolean(vehicle.dealerId ||
                vehicle.showroomId),
        ];
        return Math.round(checks.filter(Boolean).length /
            checks.length *
            100);
    }
    confidence(input) {
        let score = input.completeness * 0.65;
        score +=
            Math.min(20, input.channelCount * 3);
        score +=
            input.price > 0
                ? 15
                : 0;
        return Math.min(99, Math.round(score));
    }
    recommendation(input) {
        if (input.completeness < 60) {
            return "Complete vehicle data before launching the campaign.";
        }
        if (input.price <= 0) {
            return "Add a verified vehicle price before enabling paid channels.";
        }
        if (input.channelCount >= 5) {
            return "Launch a multi-channel campaign and measure lead quality by source.";
        }
        return "Launch the selected channels and monitor results before scaling.";
    }
    risks(input) {
        const risks = [];
        if (input.price <= 0) {
            risks.push("missing_price");
        }
        if (input.completeness < 70) {
            risks.push("incomplete_vehicle_data");
        }
        if (!input.vehicle.color) {
            risks.push("missing_color");
        }
        if (!input.vehicle.location &&
            !input.vehicle.inventory?.location) {
            risks.push("missing_location");
        }
        return risks;
    }
    text(value, fallback) {
        if (typeof value !== "string") {
            return fallback;
        }
        return (value.trim() ||
            fallback);
    }
    integer(value, fallback, minimum, maximum) {
        const numeric = Number(value);
        if (!Number.isInteger(numeric)) {
            return fallback;
        }
        return Math.min(maximum, Math.max(minimum, numeric));
    }
    money(value, fallback) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric) ||
            numeric < 0) {
            return fallback;
        }
        if (numeric > 1000000) {
            throw new common_1.BadRequestException("Campaign budget exceeds the supported limit.");
        }
        return Number(numeric.toFixed(2));
    }
};
exports.AiCampaignManagerService = AiCampaignManagerService;
exports.AiCampaignManagerService = AiCampaignManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiCampaignManagerService);
//# sourceMappingURL=ai-campaign-manager.service.js.map