import { PrismaService } from "../../prisma/prisma.service";
import { PublisherContext, PublisherResult } from "../contracts/publisher.types";
import { VehicleSlugService } from "./vehicle-slug.service";
import { VehiclePublicUrlService } from "./vehicle-public-url.service";
import { VehicleSeoMetadataService } from "./vehicle-seo-metadata.service";
import { WebsiteSearchIndexService } from "./website-search-index.service";
import { WebsiteSitemapService } from "./website-sitemap.service";
export declare class WebsitePublishingService {
    private readonly prisma;
    private readonly slugService;
    private readonly urlService;
    private readonly seoService;
    private readonly searchIndex;
    private readonly sitemap;
    private readonly logger;
    constructor(prisma: PrismaService, slugService: VehicleSlugService, urlService: VehiclePublicUrlService, seoService: VehicleSeoMetadataService, searchIndex: WebsiteSearchIndexService, sitemap: WebsiteSitemapService);
    publish(context: PublisherContext): Promise<PublisherResult>;
}
