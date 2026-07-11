"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialProviderConfigurationService = void 0;
const common_1 = require("@nestjs/common");
let SocialProviderConfigurationService = class SocialProviderConfigurationService {
    get(channel) {
        switch (channel) {
            case "instagram":
                return this.configuration(channel, process.env.INSTAGRAM_DELIVERY_URL, process.env.INSTAGRAM_ACCESS_TOKEN, process.env.INSTAGRAM_ACCOUNT_ID);
            case "tiktok":
                return this.configuration(channel, process.env.TIKTOK_DELIVERY_URL, process.env.TIKTOK_ACCESS_TOKEN, process.env.TIKTOK_ACCOUNT_ID);
            case "google_search":
                return this.configuration(channel, process.env.GOOGLE_SEARCH_DELIVERY_URL, process.env.GOOGLE_ADS_ACCESS_TOKEN, process.env.GOOGLE_ADS_CUSTOMER_ID);
        }
    }
    all() {
        return [
            this.get("instagram"),
            this.get("tiktok"),
            this.get("google_search"),
        ];
    }
    configuration(channel, endpoint, accessToken, accountId) {
        const normalizedEndpoint = endpoint?.trim() || null;
        const normalizedToken = accessToken?.trim() || null;
        const normalizedAccountId = accountId?.trim() || null;
        return {
            channel,
            endpoint: normalizedEndpoint,
            accessToken: normalizedToken,
            accountId: normalizedAccountId,
            timeoutMs: this.positiveInteger(process.env.SOCIAL_DELIVERY_TIMEOUT_MS, 20_000),
            configured: Boolean(normalizedEndpoint),
        };
    }
    positiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
};
exports.SocialProviderConfigurationService = SocialProviderConfigurationService;
exports.SocialProviderConfigurationService = SocialProviderConfigurationService = __decorate([
    (0, common_1.Injectable)()
], SocialProviderConfigurationService);
//# sourceMappingURL=social-provider-configuration.service.js.map