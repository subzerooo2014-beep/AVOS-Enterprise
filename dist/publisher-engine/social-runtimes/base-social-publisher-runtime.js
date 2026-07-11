"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSocialPublisherRuntime = void 0;
class BaseSocialPublisherRuntime {
    constructor(prisma, vehicles, contentBuilder, publicationEvents) {
        this.prisma = prisma;
        this.vehicles = vehicles;
        this.contentBuilder = contentBuilder;
        this.publicationEvents = publicationEvents;
    }
    async publish(context) {
        const vehicle = await this.vehicles.loadVehicle(this.prisma, context);
        const content = this.contentBuilder.build(this.channel, vehicle, context);
        const publication = await this.publicationEvents.createOrRefresh({
            channel: this.channel,
            vehicleId: vehicle.id,
            payload: {
                vehicle: {
                    id: vehicle.id,
                    vin: vehicle.vin,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    status: vehicle.status,
                    location: vehicle.location ??
                        vehicle.inventory?.location ??
                        null,
                    price: this.vehicles.price(vehicle, context),
                    trim: vehicle.trim
                        ? {
                            id: vehicle.trim.id,
                            name: vehicle.trim.name,
                            engine: vehicle.trim.engine,
                            gearbox: vehicle.trim.gearbox,
                            fuelType: vehicle.trim.fuelType,
                        }
                        : null,
                },
                content,
                campaign: {
                    ...content.campaign,
                    targetUrl: content.targetUrl,
                },
                publisher: {
                    engine: "PublisherEngineV2",
                    runtime: `${this.channel}-runtime-v1`,
                    attempt: context.attempt,
                },
            },
            correlationId: context.correlationId,
        });
        await this.prisma.auditLog.create({
            data: {
                action: `${this.channel
                    .toUpperCase()}_PUBLICATION_QUEUED`,
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`Social publication queued: channel=${this.channel}, vehicleId=${vehicle.id}, eventId=${publication.eventId}`);
        return {
            status: "published",
            channel: this.channel,
            externalId: `${this.channel}:${publication.eventId}`,
            message: `${this.channel} vehicle publication queued successfully.`,
            metadata: {
                vehicleId: vehicle.id,
                eventId: publication.eventId,
                operation: publication.operation,
                deliveryStatus: publication.status,
                content,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
}
exports.BaseSocialPublisherRuntime = BaseSocialPublisherRuntime;
//# sourceMappingURL=base-social-publisher-runtime.js.map