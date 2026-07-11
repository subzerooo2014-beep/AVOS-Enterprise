"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InstagramApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramApiService = void 0;
const common_1 = require("@nestjs/common");
const base_external_http_provider_1 = require("../base-external-http-provider");
let InstagramApiService = InstagramApiService_1 = class InstagramApiService extends base_external_http_provider_1.BaseExternalHttpProvider {
    constructor() {
        super(...arguments);
        this.channel = "instagram";
        this.logger = new common_1.Logger(InstagramApiService_1.name);
    }
    endpoint() {
        return (process.env
            .INSTAGRAM_DELIVERY_URL
            ?.trim() ||
            null);
    }
    accessToken() {
        return (process.env
            .INSTAGRAM_ACCESS_TOKEN
            ?.trim() ||
            null);
    }
    accountId() {
        return (process.env
            .INSTAGRAM_ACCOUNT_ID
            ?.trim() ||
            null);
    }
    buildRequestBody(request, accountId) {
        const content = request.payload?.content ??
            {};
        return {
            platform: "instagram",
            accountId,
            eventId: request.eventId,
            attempt: request.attempt,
            publication: {
                caption: content.caption ?? "",
                imageUrl: content.media?.imageUrl ??
                    null,
                videoUrl: content.media?.videoUrl ??
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
exports.InstagramApiService = InstagramApiService;
exports.InstagramApiService = InstagramApiService = InstagramApiService_1 = __decorate([
    (0, common_1.Injectable)()
], InstagramApiService);
//# sourceMappingURL=instagram-api.service.js.map