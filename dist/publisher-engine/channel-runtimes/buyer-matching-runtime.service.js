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
var BuyerMatchingRuntimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerMatchingRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_vehicle_context_service_1 = require("./publisher-vehicle-context.service");
const publisher_platform_event_service_1 = require("./publisher-platform-event.service");
let BuyerMatchingRuntimeService = BuyerMatchingRuntimeService_1 = class BuyerMatchingRuntimeService {
    constructor(prisma, vehicles, events) {
        this.prisma = prisma;
        this.vehicles = vehicles;
        this.events = events;
        this.logger = new common_1.Logger(BuyerMatchingRuntimeService_1.name);
    }
    async publish(context) {
        const vehicle = await this.vehicles.loadVehicle(this.prisma, context);
        const activeLeads = await this.prisma.lead.findMany({
            where: {
                status: {
                    in: [
                        "NEW",
                        "OPEN",
                        "CONTACTED",
                        "QUALIFIED",
                    ],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        });
        const vehicleTerms = [
            vehicle.make,
            vehicle.model,
            vehicle.year,
            vehicle.color,
            vehicle.location,
        ]
            .filter(Boolean)
            .map((value) => String(value).toLowerCase());
        const matches = activeLeads
            .map((lead) => {
            const text = [
                lead.name,
                lead.source,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            const matchedTerms = vehicleTerms.filter((term) => text.includes(term));
            const score = Math.min(100, 40 +
                matchedTerms.length * 15 +
                (lead.phone
                    ? 10
                    : 0));
            return {
                leadId: lead.id,
                name: lead.name,
                phone: lead.phone,
                source: lead.source,
                score,
                matchedTerms,
            };
        })
            .filter((match) => match.score >= 55)
            .sort((a, b) => b.score - a.score)
            .slice(0, 25);
        const event = await this.events.create({
            type: "VehicleBuyerMatchingCompleted",
            source: "publisher-engine.matched-buyers",
            entityType: "vehicle",
            entityId: vehicle.id,
            status: "completed",
            payload: {
                vehicleId: vehicle.id,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                price: this.vehicles.price(vehicle, context),
                totalLeadsChecked: activeLeads.length,
            },
            result: {
                matchCount: matches.length,
                matches,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: "BUYER_MATCHING_PUBLISHED",
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`Buyer matching completed: vehicleId=${vehicle.id}, matches=${matches.length}`);
        return {
            status: "published",
            channel: "matched_buyers",
            externalId: `buyer-matches:${event.id}`,
            message: `Buyer matching completed with ${matches.length} match(es).`,
            metadata: {
                vehicleId: vehicle.id,
                eventId: event.id,
                totalLeadsChecked: activeLeads.length,
                matchCount: matches.length,
                matches,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
};
exports.BuyerMatchingRuntimeService = BuyerMatchingRuntimeService;
exports.BuyerMatchingRuntimeService = BuyerMatchingRuntimeService = BuyerMatchingRuntimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_vehicle_context_service_1.PublisherVehicleContextService,
        publisher_platform_event_service_1.PublisherPlatformEventService])
], BuyerMatchingRuntimeService);
//# sourceMappingURL=buyer-matching-runtime.service.js.map