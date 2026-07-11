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
var InternalPublisherRuntimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalPublisherRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_vehicle_context_service_1 = require("./publisher-vehicle-context.service");
const publisher_platform_event_service_1 = require("./publisher-platform-event.service");
let InternalPublisherRuntimeService = InternalPublisherRuntimeService_1 = class InternalPublisherRuntimeService {
    constructor(prisma, vehicles, events) {
        this.prisma = prisma;
        this.vehicles = vehicles;
        this.events = events;
        this.logger = new common_1.Logger(InternalPublisherRuntimeService_1.name);
    }
    async publish(context) {
        const vehicle = await this.vehicles.loadVehicle(this.prisma, context);
        const event = await this.events.create({
            type: "InternalVehiclePublicationCompleted",
            source: "publisher-engine.internal",
            entityType: "vehicle",
            entityId: vehicle.id,
            status: "completed",
            payload: {
                vehicleId: vehicle.id,
                vin: vehicle.vin,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                status: vehicle.status,
                location: vehicle.location,
                price: this.vehicles.price(vehicle, context),
                publicationResult: context.result,
                correlationId: context.correlationId,
            },
            result: {
                analyticsRefresh: true,
                searchRefresh: true,
                aiFeedbackRequested: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: "INTERNAL_VEHICLE_PUBLISHED",
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`Internal publication completed: vehicleId=${vehicle.id}, eventId=${event.id}`);
        return {
            status: "published",
            channel: "internal",
            externalId: event.id,
            message: "Vehicle published to AVOS internal runtime.",
            metadata: {
                vehicleId: vehicle.id,
                eventId: event.id,
                analyticsRefresh: true,
                searchRefresh: true,
                aiFeedbackRequested: true,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
};
exports.InternalPublisherRuntimeService = InternalPublisherRuntimeService;
exports.InternalPublisherRuntimeService = InternalPublisherRuntimeService = InternalPublisherRuntimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_vehicle_context_service_1.PublisherVehicleContextService,
        publisher_platform_event_service_1.PublisherPlatformEventService])
], InternalPublisherRuntimeService);
//# sourceMappingURL=internal-publisher-runtime.service.js.map