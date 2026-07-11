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
var DealerPublisherRuntimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealerPublisherRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_vehicle_context_service_1 = require("./publisher-vehicle-context.service");
const publisher_platform_event_service_1 = require("./publisher-platform-event.service");
let DealerPublisherRuntimeService = DealerPublisherRuntimeService_1 = class DealerPublisherRuntimeService {
    constructor(prisma, vehicles, events) {
        this.prisma = prisma;
        this.vehicles = vehicles;
        this.events = events;
        this.logger = new common_1.Logger(DealerPublisherRuntimeService_1.name);
    }
    async publish(context) {
        const vehicle = await this.vehicles.loadVehicle(this.prisma, context);
        const dealers = await this.prisma.dealer.findMany({
            where: {
                OR: [
                    {
                        status: "ACTIVE",
                    },
                    {
                        status: "active",
                    },
                    {
                        status: null,
                    },
                ],
            },
            orderBy: {
                createdAt: "asc",
            },
            take: 100,
        });
        const distributions = [];
        for (const dealer of dealers) {
            if (vehicle.dealerId &&
                dealer.id === vehicle.dealerId) {
                continue;
            }
            const event = await this.events.create({
                type: "DealerVehicleDistributionRequested",
                source: "publisher-engine.dealer-network",
                entityType: "dealer",
                entityId: dealer.id,
                status: "queued",
                payload: {
                    dealerId: dealer.id,
                    dealerName: dealer.name,
                    vehicleId: vehicle.id,
                    vin: vehicle.vin,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    location: vehicle.location,
                    price: this.vehicles.price(vehicle, context),
                    correlationId: context.correlationId,
                },
                result: {
                    message: "Vehicle queued for dealer distribution.",
                },
            });
            distributions.push({
                dealerId: dealer.id,
                dealerName: dealer.name,
                eventId: event.id,
                status: "queued",
            });
        }
        await this.prisma.auditLog.create({
            data: {
                action: "DEALER_NETWORK_PUBLISHED",
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`Dealer distribution created: vehicleId=${vehicle.id}, dealers=${distributions.length}`);
        return {
            status: "published",
            channel: "dealer_network",
            externalId: `dealer-network:${vehicle.id}`,
            message: `Vehicle distributed to ${distributions.length} dealer(s).`,
            metadata: {
                vehicleId: vehicle.id,
                dealerCount: distributions.length,
                distributions,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
};
exports.DealerPublisherRuntimeService = DealerPublisherRuntimeService;
exports.DealerPublisherRuntimeService = DealerPublisherRuntimeService = DealerPublisherRuntimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_vehicle_context_service_1.PublisherVehicleContextService,
        publisher_platform_event_service_1.PublisherPlatformEventService])
], DealerPublisherRuntimeService);
//# sourceMappingURL=dealer-publisher-runtime.service.js.map