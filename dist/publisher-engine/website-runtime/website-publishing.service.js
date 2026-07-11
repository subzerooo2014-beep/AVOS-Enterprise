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
var WebsitePublishingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsitePublishingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const vehicle_slug_service_1 = require("./vehicle-slug.service");
const vehicle_public_url_service_1 = require("./vehicle-public-url.service");
const vehicle_seo_metadata_service_1 = require("./vehicle-seo-metadata.service");
const website_search_index_service_1 = require("./website-search-index.service");
const website_sitemap_service_1 = require("./website-sitemap.service");
let WebsitePublishingService = WebsitePublishingService_1 = class WebsitePublishingService {
    constructor(prisma, slugService, urlService, seoService, searchIndex, sitemap) {
        this.prisma = prisma;
        this.slugService = slugService;
        this.urlService = urlService;
        this.seoService = seoService;
        this.searchIndex = searchIndex;
        this.sitemap = sitemap;
        this.logger = new common_1.Logger(WebsitePublishingService_1.name);
    }
    async publish(context) {
        const vehicleId = context.vehicleId ??
            context.result?.vehicleId ??
            context.result?.entityId ??
            context.result?.metadata?.vehicleId ??
            null;
        if (!vehicleId) {
            throw new Error("Website publishing requires a vehicleId");
        }
        const vehicle = await this.prisma.vehicle.findUnique({
            where: {
                id: vehicleId,
            },
            include: {
                inventory: true,
                brand: true,
                vehicleModel: true,
                trim: true,
                dealer: true,
                showroom: true,
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle "${vehicleId}" was not found`);
        }
        const slug = this.slugService.create(vehicle);
        const publicUrl = this.urlService.vehicle(slug);
        const creative = context.result?.creative ??
            context.result?.metadata?.creative ??
            null;
        const seo = this.seoService.create(vehicle, publicUrl, creative);
        const publishedAt = new Date();
        const publication = {
            version: "website-runtime-v1",
            vehicleId: vehicle.id,
            slug,
            publicUrl,
            canonicalUrl: this.urlService.canonical(slug),
            publishedAt: publishedAt.toISOString(),
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
                price: vehicle.inventory?.price ??
                    creative?.price ??
                    context.result?.recommendedPrice ??
                    null,
                trim: vehicle.trim
                    ? {
                        id: vehicle.trim.id,
                        name: vehicle.trim.name,
                        engine: vehicle.trim.engine,
                        gearbox: vehicle.trim.gearbox,
                        fuelType: vehicle.trim.fuelType,
                    }
                    : null,
                dealer: vehicle.dealer
                    ? {
                        id: vehicle.dealer.id,
                        name: vehicle.dealer.name,
                    }
                    : null,
                showroom: vehicle.showroom
                    ? {
                        id: vehicle.showroom.id,
                        name: vehicle.showroom.name,
                    }
                    : null,
            },
            seo,
            publicationState: {
                visibility: "public",
                searchable: true,
                sitemapIncluded: true,
            },
        };
        const searchDocument = {
            vehicleId: vehicle.id,
            slug,
            publicUrl,
            title: seo.title,
            description: seo.description,
            searchableText: [
                vehicle.year,
                vehicle.make,
                vehicle.model,
                vehicle.color,
                vehicle.trim?.name,
                vehicle.location,
                vehicle.inventory?.location,
                context.content,
            ]
                .filter(Boolean)
                .join(" "),
            filters: {
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                status: vehicle.status,
                location: vehicle.location ??
                    vehicle.inventory?.location ??
                    null,
                dealerId: vehicle.dealerId,
                showroomId: vehicle.showroomId,
                price: vehicle.inventory?.price ??
                    creative?.price ??
                    null,
            },
            indexedAt: publishedAt.toISOString(),
        };
        const indexResult = await this.searchIndex.upsert(vehicle, searchDocument);
        const sitemapResult = await this.sitemap.requestRefresh(vehicle.id, publicUrl, publishedAt);
        await this.prisma.auditLog.create({
            data: {
                action: "WEBSITE_VEHICLE_PUBLISHED",
                entity: "Vehicle",
                entityId: vehicle.id,
            },
        });
        this.logger.log(`Vehicle published to website runtime: vehicleId=${vehicle.id}, publicUrl=${publicUrl}`);
        return {
            status: "published",
            channel: "website",
            externalId: publicUrl,
            message: "Vehicle published to AVOS website runtime.",
            metadata: {
                vehicleId: vehicle.id,
                slug,
                publicUrl,
                seo,
                publication,
                searchIndex: indexResult,
                sitemap: sitemapResult,
                attempt: context.attempt,
                correlationId: context.correlationId,
            },
        };
    }
};
exports.WebsitePublishingService = WebsitePublishingService;
exports.WebsitePublishingService = WebsitePublishingService = WebsitePublishingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicle_slug_service_1.VehicleSlugService,
        vehicle_public_url_service_1.VehiclePublicUrlService,
        vehicle_seo_metadata_service_1.VehicleSeoMetadataService,
        website_search_index_service_1.WebsiteSearchIndexService,
        website_sitemap_service_1.WebsiteSitemapService])
], WebsitePublishingService);
//# sourceMappingURL=website-publishing.service.js.map