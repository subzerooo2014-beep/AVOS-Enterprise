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
var CrmPublisherRuntimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmPublisherRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const publisher_vehicle_context_service_1 = require("./publisher-vehicle-context.service");
const publisher_platform_event_service_1 = require("./publisher-platform-event.service");
let CrmPublisherRuntimeService = CrmPublisherRuntimeService_1 = class CrmPublisherRuntimeService {
    constructor(prisma, vehicles, events) {
        this.prisma = prisma;
        this.vehicles = vehicles;
        this.events = events;
        this.logger = new common_1.Logger(CrmPublisherRuntimeService_1.name);
    }
    async publish(context) {
        const vehicle = await this.vehicles.loadVehicle(this.prisma, context);
        const vehicleTitle = this.vehicles.title(vehicle);
        const source = `publisher:crm_leads:vehicle:${vehicle.id}`;
        const existing = await this.prisma.lead.findFirst({
            where: {
                source,
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
        });
        const lead = existing
            ? await this.prisma.lead.update({
                where: {
                    id: existing.id,
                },
                data: {
                    name: `Vehicle interest: ${vehicleTitle}`,
                    status: "NEW",
                    source,
                },
            })
            : await this.prisma.lead.create({
                data: {
                    name: `Vehicle interest: ${vehicleTitle}`,
                    phone: null,
                    source,
                    status: "NEW",
                },
            });
        const event = await this.events.create({
            type: "CrmLeadPublished",
            source: "publisher-engine.crm-leads",
            entityType: "vehicle",
            entityId: vehicle.id,
            status: "completed",
            payload: {
                vehicleId: vehicle.id,
                leadId: lead.id,
                title: vehicleTitle,
                price: this.vehicles.price(vehicle, context),
                channel: "crm_leads",
                correlationId: context.correlationId,
            },
            result: {
                operation: existing
                    ? "updated"
                    : "created",
                leadId: lead.id,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: "CRM_LEAD_PUBLISHED",
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`CRM lead published: vehicleId=${vehicle.id}, leadId=${lead.id}`);
        return {
            status: "published",
            channel: "crm_leads",
            externalId: lead.id,
            message: "Vehicle published to AVOS CRM leads.",
            metadata: {
                vehicleId: vehicle.id,
                leadId: lead.id,
                operation: existing
                    ? "updated"
                    : "created",
                source,
                eventId: event.id,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
};
exports.CrmPublisherRuntimeService = CrmPublisherRuntimeService;
exports.CrmPublisherRuntimeService = CrmPublisherRuntimeService = CrmPublisherRuntimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publisher_vehicle_context_service_1.PublisherVehicleContextService,
        publisher_platform_event_service_1.PublisherPlatformEventService])
], CrmPublisherRuntimeService);
//# sourceMappingURL=crm-publisher-runtime.service.js.map