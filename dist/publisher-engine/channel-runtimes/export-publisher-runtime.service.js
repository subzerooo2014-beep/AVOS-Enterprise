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
var ExportPublisherRuntimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportPublisherRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_vehicle_context_service_1 = require("./publisher-vehicle-context.service");
const publisher_platform_event_service_1 = require("./publisher-platform-event.service");
let ExportPublisherRuntimeService = ExportPublisherRuntimeService_1 = class ExportPublisherRuntimeService {
    constructor(prisma, vehicles, events) {
        this.prisma = prisma;
        this.vehicles = vehicles;
        this.events = events;
        this.logger = new common_1.Logger(ExportPublisherRuntimeService_1.name);
    }
    async publish(context) {
        const vehicle = await this.vehicles.loadVehicle(this.prisma, context);
        const exportSummary = context.result?.summary
            ?.exportOpportunity ??
            context.result?.exportOpportunity ??
            {};
        const targetCountries = Array.isArray(exportSummary.targetCountries)
            ? exportSummary.targetCountries
            : [
                exportSummary.bestCountry ??
                    "Saudi Arabia",
                "Oman",
                "Qatar",
                "Bahrain",
                "Kuwait",
            ].filter(Boolean);
        const aiScore = this.score(exportSummary.exportScore ??
            context.result?.exportScore ??
            75);
        const demandScore = this.score(exportSummary.demandScore ??
            context.result?.demandScore ??
            aiScore);
        const title = `${this.vehicles.title(vehicle)} GCC Export Listing`;
        const existing = await this.prisma.exportVehicle.findFirst({
            where: {
                vehicleId: vehicle.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const data = {
            vehicleId: vehicle.id,
            title,
            condition: context.result?.condition ??
                "used",
            targetCountries,
            exportOnly: true,
            localSale: true,
            shippingReady: Boolean(context.result?.shippingReady),
            documentsReady: Boolean(context.result?.documentsReady),
            aiScore,
            demandScore,
            metadata: {
                vehicle: {
                    vin: vehicle.vin,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    location: vehicle.location,
                    price: this.vehicles.price(vehicle, context),
                },
                exportOpportunity: exportSummary,
                source: "publisher-engine.gcc-export",
                correlationId: context.correlationId,
            },
        };
        const exportVehicle = existing
            ? await this.prisma.exportVehicle.update({
                where: {
                    id: existing.id,
                },
                data,
            })
            : await this.prisma.exportVehicle.create({
                data,
            });
        const event = await this.events.create({
            type: "GccExportVehiclePublished",
            source: "publisher-engine.gcc-export",
            entityType: "vehicle",
            entityId: vehicle.id,
            status: "completed",
            payload: {
                exportVehicleId: exportVehicle.id,
                vehicleId: vehicle.id,
                targetCountries,
                aiScore,
                demandScore,
            },
            result: {
                operation: existing
                    ? "updated"
                    : "created",
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: "GCC_EXPORT_PUBLISHED",
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`GCC export published: vehicleId=${vehicle.id}, exportVehicleId=${exportVehicle.id}`);
        return {
            status: "published",
            channel: "gcc_export",
            externalId: exportVehicle.id,
            message: "Vehicle published to GCC export runtime.",
            metadata: {
                vehicleId: vehicle.id,
                exportVehicleId: exportVehicle.id,
                operation: existing
                    ? "updated"
                    : "created",
                targetCountries,
                aiScore,
                demandScore,
                eventId: event.id,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
    score(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return 50;
        }
        return Math.min(100, Math.max(0, Math.trunc(numeric)));
    }
};
exports.ExportPublisherRuntimeService = ExportPublisherRuntimeService;
exports.ExportPublisherRuntimeService = ExportPublisherRuntimeService = ExportPublisherRuntimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_vehicle_context_service_1.PublisherVehicleContextService,
        publisher_platform_event_service_1.PublisherPlatformEventService])
], ExportPublisherRuntimeService);
//# sourceMappingURL=export-publisher-runtime.service.js.map