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
var WebsiteSitemapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteSitemapService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let WebsiteSitemapService = WebsiteSitemapService_1 = class WebsiteSitemapService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebsiteSitemapService_1.name);
    }
    async requestRefresh(vehicleId, publicUrl, lastModified) {
        const created = await this.prisma.platformEvent.create({
            data: {
                id: (0, node_crypto_1.randomUUID)(),
                updatedAt: new Date(),
                type: "WebsiteSitemapRefreshRequested",
                source: "publisher-engine.website",
                entityType: "vehicle",
                entityId: vehicleId,
                status: "new",
                payload: {
                    vehicleId,
                    publicUrl,
                    changeFrequency: "daily",
                    priority: 0.8,
                    lastModified: lastModified.toISOString(),
                },
                result: {
                    message: "Vehicle sitemap refresh requested.",
                },
            },
        });
        this.logger.log(`Website sitemap refresh requested: vehicleId=${vehicleId}, eventId=${created.id}`);
        return {
            eventId: created.id,
            requestedAt: created.createdAt,
        };
    }
};
exports.WebsiteSitemapService = WebsiteSitemapService;
exports.WebsiteSitemapService = WebsiteSitemapService = WebsiteSitemapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebsiteSitemapService);
//# sourceMappingURL=website-sitemap.service.js.map