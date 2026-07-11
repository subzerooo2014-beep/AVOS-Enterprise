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
var WebsiteSearchIndexService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteSearchIndexService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let WebsiteSearchIndexService = WebsiteSearchIndexService_1 = class WebsiteSearchIndexService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebsiteSearchIndexService_1.name);
    }
    async upsert(vehicle, document) {
        const existing = await this.prisma.platformEvent.findFirst({
            where: {
                type: "WebsiteVehicleIndexRequested",
                entityType: "vehicle",
                entityId: vehicle.id,
                status: {
                    in: ["new", "queued"],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (existing) {
            const updated = await this.prisma.platformEvent.update({
                where: {
                    id: existing.id,
                },
                data: {
                    updatedAt: new Date(),
                    source: "publisher-engine.website",
                    status: "new",
                    payload: document,
                    result: {
                        message: "Website vehicle search index event refreshed.",
                    },
                },
            });
            return {
                operation: "refreshed",
                eventId: updated.id,
            };
        }
        const created = await this.prisma.platformEvent.create({
            data: {
                id: (0, node_crypto_1.randomUUID)(),
                updatedAt: new Date(),
                type: "WebsiteVehicleIndexRequested",
                source: "publisher-engine.website",
                entityType: "vehicle",
                entityId: vehicle.id,
                status: "new",
                payload: document,
                result: {
                    message: "Website vehicle search index event created.",
                },
            },
        });
        this.logger.log(`Website search indexing requested: vehicleId=${vehicle.id}, eventId=${created.id}`);
        return {
            operation: "created",
            eventId: created.id,
        };
    }
};
exports.WebsiteSearchIndexService = WebsiteSearchIndexService;
exports.WebsiteSearchIndexService = WebsiteSearchIndexService = WebsiteSearchIndexService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebsiteSearchIndexService);
//# sourceMappingURL=website-search-index.service.js.map