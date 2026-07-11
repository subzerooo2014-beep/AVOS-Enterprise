"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleSeoMetadataService = void 0;
const common_1 = require("@nestjs/common");
let VehicleSeoMetadataService = class VehicleSeoMetadataService {
    create(vehicle, publicUrl, creative) {
        const price = vehicle?.inventory?.price ??
            creative?.price ??
            creative?.recommendedPrice ??
            null;
        const location = vehicle?.location ??
            vehicle?.inventory?.location ??
            "UAE";
        const displayName = [
            vehicle?.year,
            vehicle?.make,
            vehicle?.model,
            vehicle?.trim?.name,
        ]
            .filter(Boolean)
            .join(" ");
        const title = this.limit(creative?.title ||
            `${displayName} for sale in ${location} | AVOS`, 65);
        const description = this.limit(creative?.content ||
            this.description(displayName, vehicle, location, price), 160);
        const image = creative?.imageUrl ??
            creative?.primaryImageUrl ??
            null;
        const keywords = Array.from(new Set([
            vehicle?.make,
            vehicle?.model,
            vehicle?.year,
            vehicle?.color,
            vehicle?.trim?.name,
            location,
            "cars for sale",
            "AVOS",
            "UAE cars",
        ]
            .filter(Boolean)
            .map((value) => String(value))));
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: displayName,
            url: publicUrl,
            vehicleIdentificationNumber: vehicle?.vin ?? undefined,
            vehicleModelDate: vehicle?.year
                ? String(vehicle.year)
                : undefined,
            manufacturer: vehicle?.make
                ? {
                    "@type": "Organization",
                    name: vehicle.make,
                }
                : undefined,
            model: vehicle?.model ?? undefined,
            color: vehicle?.color ?? undefined,
            image: image ?? undefined,
            offers: price
                ? {
                    "@type": "Offer",
                    price,
                    priceCurrency: "AED",
                    availability: vehicle?.status
                        ?.toLowerCase()
                        .includes("available")
                        ? "https://schema.org/InStock"
                        : "https://schema.org/LimitedAvailability",
                    url: publicUrl,
                }
                : undefined,
        };
        return {
            title,
            description,
            canonicalUrl: publicUrl,
            robots: "index,follow",
            keywords,
            openGraph: {
                type: "website",
                title,
                description,
                url: publicUrl,
                image,
                siteName: "AVOS",
                locale: "en_AE",
            },
            twitter: {
                card: image
                    ? "summary_large_image"
                    : "summary",
                title,
                description,
                image,
            },
            structuredData,
        };
    }
    description(displayName, vehicle, location, price) {
        return [
            `${displayName} available through AVOS`,
            vehicle?.color
                ? `Color: ${vehicle.color}`
                : null,
            `Location: ${location}`,
            price
                ? `Price: AED ${price}`
                : null,
            vehicle?.vin
                ? `Verified vehicle reference ${vehicle.vin}`
                : null,
        ]
            .filter(Boolean)
            .join(". ");
    }
    limit(value, length) {
        const normalized = String(value)
            .replace(/\s+/g, " ")
            .trim();
        if (normalized.length <= length) {
            return normalized;
        }
        return `${normalized
            .slice(0, Math.max(0, length - 1))
            .trim()}…`;
    }
};
exports.VehicleSeoMetadataService = VehicleSeoMetadataService;
exports.VehicleSeoMetadataService = VehicleSeoMetadataService = __decorate([
    (0, common_1.Injectable)()
], VehicleSeoMetadataService);
//# sourceMappingURL=vehicle-seo-metadata.service.js.map