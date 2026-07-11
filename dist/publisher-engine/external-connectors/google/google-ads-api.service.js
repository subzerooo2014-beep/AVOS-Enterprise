"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GoogleAdsApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAdsApiService = void 0;
const common_1 = require("@nestjs/common");
const base_external_http_provider_1 = require("../base-external-http-provider");
let GoogleAdsApiService = GoogleAdsApiService_1 = class GoogleAdsApiService extends base_external_http_provider_1.BaseExternalHttpProvider {
    constructor() {
        super(...arguments);
        this.channel = "google_search";
        this.logger = new common_1.Logger(GoogleAdsApiService_1.name);
    }
    endpoint() {
        return (process.env
            .GOOGLE_SEARCH_DELIVERY_URL
            ?.trim() ||
            null);
    }
    accessToken() {
        return (process.env
            .GOOGLE_ADS_ACCESS_TOKEN
            ?.trim() ||
            null);
    }
    accountId() {
        return (process.env
            .GOOGLE_ADS_CUSTOMER_ID
            ?.trim() ||
            null);
    }
    buildRequestBody(request, accountId) {
        const content = request.payload?.content ??
            {};
        return {
            platform: "google_search",
            customerId: accountId,
            eventId: request.eventId,
            attempt: request.attempt,
            campaign: {
                objective: content.campaign?.objective ??
                    "high_intent_vehicle_leads",
                headline: content.headline ?? "",
                description: content.description ?? "",
                finalUrl: content.targetUrl ??
                    null,
                keywords: content.keywords ?? [],
                country: content.campaign?.country ??
                    "AE",
                language: content.campaign?.language ??
                    "en",
                budgetMode: content.campaign?.budgetMode ??
                    "organic",
            },
            vehicle: request.payload?.vehicle ??
                null,
            rawPayload: request.payload,
        };
    }
};
exports.GoogleAdsApiService = GoogleAdsApiService;
exports.GoogleAdsApiService = GoogleAdsApiService = GoogleAdsApiService_1 = __decorate([
    (0, common_1.Injectable)()
], GoogleAdsApiService);
//# sourceMappingURL=google-ads-api.service.js.map