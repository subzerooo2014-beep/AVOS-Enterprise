import {
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import {
  PublisherContext,
  PublisherResult,
} from "../contracts/publisher.types";

import { VehicleSlugService } from "./vehicle-slug.service";
import { VehiclePublicUrlService } from "./vehicle-public-url.service";
import { VehicleSeoMetadataService } from "./vehicle-seo-metadata.service";
import { WebsiteSearchIndexService } from "./website-search-index.service";
import { WebsiteSitemapService } from "./website-sitemap.service";

@Injectable()
export class WebsitePublishingService {
  private readonly logger = new Logger(
    WebsitePublishingService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: VehicleSlugService,
    private readonly urlService: VehiclePublicUrlService,
    private readonly seoService: VehicleSeoMetadataService,
    private readonly searchIndex: WebsiteSearchIndexService,
    private readonly sitemap: WebsiteSitemapService,
  ) {}

  async publish(
    context: PublisherContext,
  ): Promise<PublisherResult> {
    const vehicleId =
      context.vehicleId ??
      context.result?.vehicleId ??
      context.result?.entityId ??
      context.result?.metadata?.vehicleId ??
      null;

    if (!vehicleId) {
      throw new Error(
        "Website publishing requires a vehicleId",
      );
    }

    const vehicle =
      await (this.prisma as any).vehicle.findUnique({
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
      throw new NotFoundException(
        `Vehicle "${vehicleId}" was not found`,
      );
    }

    const slug =
      this.slugService.create(vehicle);

    const publicUrl =
      this.urlService.vehicle(slug);

    const creative =
      context.result?.creative ??
      context.result?.metadata?.creative ??
      null;

    const seo = this.seoService.create(
      vehicle,
      publicUrl,
      creative,
    );

    const publishedAt = new Date();

    const publication = {
      version: "website-runtime-v1",
      vehicleId: vehicle.id,
      slug,
      publicUrl,
      canonicalUrl:
        this.urlService.canonical(slug),
      publishedAt:
        publishedAt.toISOString(),

      vehicle: {
        id: vehicle.id,
        vin: vehicle.vin,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        status: vehicle.status,
        location:
          vehicle.location ??
          vehicle.inventory?.location ??
          null,

        price:
          vehicle.inventory?.price ??
          creative?.price ??
          context.result?.recommendedPrice ??
          null,

        trim: vehicle.trim
          ? {
              id: vehicle.trim.id,
              name: vehicle.trim.name,
              engine: vehicle.trim.engine,
              gearbox: vehicle.trim.gearbox,
              fuelType:
                vehicle.trim.fuelType,
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
        location:
          vehicle.location ??
          vehicle.inventory?.location ??
          null,
        dealerId: vehicle.dealerId,
        showroomId: vehicle.showroomId,
        price:
          vehicle.inventory?.price ??
          creative?.price ??
          null,
      },

      indexedAt:
        publishedAt.toISOString(),
    };

    const indexResult =
      await this.searchIndex.upsert(
        vehicle,
        searchDocument,
      );

    const sitemapResult =
      await this.sitemap.requestRefresh(
        vehicle.id,
        publicUrl,
        publishedAt,
      );

    await this.prisma.auditLog.create({
      data: {
        action:
          "WEBSITE_VEHICLE_PUBLISHED",
        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `Vehicle published to website runtime: vehicleId=${vehicle.id}, publicUrl=${publicUrl}`,
    );

    return {
      status: "published",
      channel: "website",
      externalId: publicUrl,
      message:
        "Vehicle published to AVOS website runtime.",
      metadata: {
        vehicleId: vehicle.id,
        slug,
        publicUrl,
        seo,
        publication,
        searchIndex: indexResult,
        sitemap: sitemapResult,
        attempt: context.attempt,
        correlationId:
          context.correlationId,
      },
    };
  }
}


