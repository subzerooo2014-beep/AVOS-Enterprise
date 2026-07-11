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
var ExternalProviderRegistryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalProviderRegistryService = void 0;
const common_1 = require("@nestjs/common");
const instagram_api_service_1 = require("./instagram/instagram-api.service");
const tiktok_api_service_1 = require("./tiktok/tiktok-api.service");
const google_ads_api_service_1 = require("./google/google-ads-api.service");
let ExternalProviderRegistryService = ExternalProviderRegistryService_1 = class ExternalProviderRegistryService {
    constructor(instagram, tiktok, googleSearch) {
        this.logger = new common_1.Logger(ExternalProviderRegistryService_1.name);
        this.providers = new Map([
            [
                instagram.channel,
                instagram,
            ],
            [
                tiktok.channel,
                tiktok,
            ],
            [
                googleSearch.channel,
                googleSearch,
            ],
        ]);
        this.logger.log(`External providers registered: ${Array.from(this.providers.keys()).join(", ")}`);
    }
    get(channel) {
        const provider = this.providers.get(channel);
        if (!provider) {
            throw new Error(`External provider "${channel}" is not registered.`);
        }
        return provider;
    }
    list() {
        return Array.from(this.providers.values()).map((provider) => ({
            channel: provider.channel,
            configured: provider.configured(),
        }));
    }
    async health() {
        return Promise.all(Array.from(this.providers.values()).map((provider) => provider.health()));
    }
};
exports.ExternalProviderRegistryService = ExternalProviderRegistryService;
exports.ExternalProviderRegistryService = ExternalProviderRegistryService = ExternalProviderRegistryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [instagram_api_service_1.InstagramApiService,
        tiktok_api_service_1.TikTokApiService,
        google_ads_api_service_1.GoogleAdsApiService])
], ExternalProviderRegistryService);
//# sourceMappingURL=external-provider-registry.service.js.map