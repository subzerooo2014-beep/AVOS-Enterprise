"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialContentBuilderService = void 0;
const common_1 = require("@nestjs/common");
let SocialContentBuilderService = class SocialContentBuilderService {
    build(channel, vehicle, context) {
        const normalizedChannel = String(channel)
            .trim()
            .toLowerCase();
        const creative = context.result?.creative ??
            context.result?.metadata?.creative ??
            {};
        const price = vehicle?.inventory?.price ??
            context.result?.recommendedPrice ??
            creative?.price ??
            null;
        const vehicleName = [
            vehicle?.year,
            vehicle?.make,
            vehicle?.model,
            vehicle?.trim?.name,
        ]
            .filter(Boolean)
            .join(" ");
        const location = vehicle?.location ??
            vehicle?.inventory?.location ??
            "UAE";
        const targetUrl = this.resolveTargetUrl(vehicle, context);
        const headline = creative?.title ??
            this.defaultHeadline(normalizedChannel, vehicleName, location);
        const description = creative?.content ??
            this.defaultDescription(normalizedChannel, vehicleName, vehicle, location, price);
        const hashtags = this.buildHashtags(normalizedChannel, vehicle, location);
        const callToAction = this.callToAction(normalizedChannel);
        return {
            headline,
            caption: this.buildCaption({
                channel: normalizedChannel,
                headline,
                description,
                price,
                callToAction,
                targetUrl,
                hashtags,
            }),
            description,
            hashtags,
            callToAction,
            targetUrl,
            keywords: Array.from(new Set([
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
                .map(String))),
            media: {
                imageUrl: creative?.imageUrl ??
                    creative?.primaryImageUrl ??
                    context.result?.imageUrl ??
                    context.result?.metadata?.imageUrl ??
                    null,
                videoUrl: creative?.videoUrl ??
                    context.result?.videoUrl ??
                    context.result?.metadata?.videoUrl ??
                    null,
            },
            campaign: {
                objective: this.objective(normalizedChannel),
                audience: context.result?.audience ??
                    "UAE vehicle buyers",
                language: context.result?.language ??
                    "en",
                country: context.result?.country ??
                    "AE",
                budgetMode: context.result?.budgetMode ??
                    "organic",
            },
        };
    }
    resolveTargetUrl(vehicle, context) {
        const supplied = context.result?.publicUrl ??
            context.result?.metadata?.publicUrl ??
            context.result?.publication?.publicUrl ??
            context.result?.metadata?.publication?.publicUrl ??
            null;
        if (typeof supplied === "string" &&
            supplied.trim()) {
            return supplied.trim();
        }
        const baseUrl = (process.env.AVOS_WEBSITE_URL ??
            process.env.WEBSITE_BASE_URL ??
            "https://avos.ae").replace(/\/+$/, "");
        return `${baseUrl}/vehicles/${encodeURIComponent(String(vehicle?.id ?? ""))}`;
    }
    defaultHeadline(channel, vehicleName, location) {
        switch (channel) {
            case "instagram":
                return `${vehicleName} now available in ${location}`;
            case "tiktok":
                return `Discover this ${vehicleName}`;
            case "google_search":
                return `${vehicleName} for sale in ${location}`;
            default:
                return `${vehicleName} available through AVOS`;
        }
    }
    defaultDescription(channel, vehicleName, vehicle, location, price) {
        const details = [
            vehicleName,
            vehicle?.color
                ? `Color: ${vehicle.color}`
                : null,
            `Location: ${location}`,
            price
                ? `Price: AED ${price}`
                : null,
            vehicle?.vin
                ? `Vehicle reference: ${vehicle.vin}`
                : null,
        ]
            .filter(Boolean)
            .join(" | ");
        switch (channel) {
            case "instagram":
                return `${details}. Explore the vehicle through AVOS.`;
            case "tiktok":
                return `${details}. Smart vehicle discovery powered by AVOS.`;
            case "google_search":
                return `${details}. View availability and details on AVOS.`;
            default:
                return details;
        }
    }
    buildHashtags(channel, vehicle, location) {
        const common = [
            "#AVOS",
            "#CarsForSale",
            "#UAE",
            this.hashtag(vehicle?.make),
            this.hashtag(vehicle?.model),
            this.hashtag(vehicle?.year),
            this.hashtag(location),
        ].filter(Boolean);
        const additional = channel === "instagram"
            ? [
                "#DubaiCars",
                "#AbuDhabiCars",
                "#CarDeals",
                "#AutoMarket",
            ]
            : channel === "tiktok"
                ? [
                    "#CarTok",
                    "#TikTokCars",
                    "#CarReview",
                    "#DreamCar",
                ]
                : [
                    "#BuyCarUAE",
                    "#UsedCarsUAE",
                ];
        return Array.from(new Set([
            ...common,
            ...additional,
        ])).slice(0, channel === "instagram"
            ? 15
            : 12);
    }
    buildCaption(input) {
        const caption = [
            input.headline,
            input.description,
            input.price
                ? `AED ${input.price}`
                : null,
            input.callToAction,
            input.targetUrl,
            input.hashtags.join(" "),
        ]
            .filter(Boolean)
            .join("\n\n");
        return caption.slice(0, input.channel === "google_search"
            ? 500
            : 2200);
    }
    callToAction(channel) {
        switch (channel) {
            case "instagram":
                return "View vehicle details";
            case "tiktok":
                return "Discover more on AVOS";
            case "google_search":
                return "View available vehicle";
            default:
                return "View now";
        }
    }
    objective(channel) {
        switch (channel) {
            case "instagram":
                return "vehicle_discovery";
            case "tiktok":
                return "video_engagement";
            case "google_search":
                return "high_intent_vehicle_leads";
            default:
                return "vehicle_awareness";
        }
    }
    hashtag(value) {
        if (typeof value !== "string" &&
            typeof value !== "number") {
            return null;
        }
        const normalized = String(value)
            .replace(/[^\p{L}\p{N}]+/gu, "")
            .trim();
        return normalized
            ? `#${normalized}`
            : null;
    }
};
exports.SocialContentBuilderService = SocialContentBuilderService;
exports.SocialContentBuilderService = SocialContentBuilderService = __decorate([
    (0, common_1.Injectable)()
], SocialContentBuilderService);
//# sourceMappingURL=social-content-builder.service.js.map