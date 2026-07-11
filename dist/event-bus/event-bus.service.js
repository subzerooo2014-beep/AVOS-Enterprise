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
exports.EventBusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_dispatcher_service_1 = require("./dispatcher/event-dispatcher.service");
let EventBusService = class EventBusService {
    constructor(prisma, dispatcher) {
        this.prisma = prisma;
        this.dispatcher = dispatcher;
    }
    async publish(type, payload = {}) {
        const event = await this.emit({
            type,
            source: payload?.source || "application-flow",
            entityType: payload?.entityType,
            entityId: payload?.entityId,
            payload,
            metadata: payload?.metadata || {},
            correlationId: payload?.correlationId,
        });
        void this.dispatcher.dispatch(event);
        return event;
    }
    async emit(data) {
        return this.prisma.platformEvent.create({
            data: {
                type: data.type,
                source: data.source || "api",
                entityType: data.entityType,
                entityId: data.entityId,
                status: "new",
                payload: data.payload || {},
                result: {
                    metadata: data.metadata || {},
                    correlationId: data.correlationId || null,
                    message: "Event received by AVOS Event Bus.",
                },
            },
        });
    }
    list(status) {
        return this.prisma.platformEvent.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: "desc" },
        });
    }
    async markProcessed(id, result = {}) {
        const event = await this.prisma.platformEvent.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Platform event not found");
        return this.prisma.platformEvent.update({
            where: { id },
            data: {
                status: "processed",
                result: {
                    ...(event.result || {}),
                    ...result,
                    processedAt: new Date().toISOString(),
                },
            },
        });
    }
};
exports.EventBusService = EventBusService;
exports.EventBusService = EventBusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_dispatcher_service_1.EventDispatcherService])
], EventBusService);
//# sourceMappingURL=event-bus.service.js.map