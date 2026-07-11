"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TikTokApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TikTokApiService = void 0;
const common_1 = require("@nestjs/common");
const base_external_http_provider_1 = require("../base-external-http-provider");
let TikTokApiService = TikTokApiService_1 = class TikTokApiService extends base_external_http_provider_1.BaseExternalHttpProvider {
    constructor() {
        super(...arguments);
        this.channel = "tiktok";
        this.logger = new common_1.Logger(TikTokApiService_1.name);
    }
    endpoint() {
        return (process.env
            .TIKTOK_DELIVERY_URL
            ?.trim() ||
            null);
    }
    accessToken() {
        return (process.env
            .TIKTOK_ACCESS_TOKEN
            ?.trim() ||
            null);
    }
    accountId() {
        return (process.env
            .TIKTOK_ACCOUNT_ID
            ?.trim() ||
            null);
    }
    buildRequestBody(request, accountId) {
        const content = request.payload?.content ??
            {};
        return {
            platform: "tiktok",
            accountId,
            eventId: request.eventId,
            attempt: request.attempt,
            publication: {
                title: content.headline ?? "",
                caption: content.caption ?? "",
                videoUrl: content.media?.videoUrl ??
                    null,
                imageUrl: content.media?.imageUrl ??
                    null,
                targetUrl: content.targetUrl ??
                    null,
                hashtags: content.hashtags ?? [],
            },
            vehicle: request.payload?.vehicle ??
                null,
            rawPayload: request.payload,
        };
    }
};
exports.TikTokApiService = TikTokApiService;
exports.TikTokApiService = TikTokApiService = TikTokApiService_1 = __decorate([
    (0, common_1.Injectable)()
], TikTokApiService);
//# sourceMappingURL=tiktok-api.service.js.map