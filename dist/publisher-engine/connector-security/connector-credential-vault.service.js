"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorCredentialVaultService = void 0;
const common_1 = require("@nestjs/common");
let ConnectorCredentialVaultService = class ConnectorCredentialVaultService {
    snapshot(channel) {
        const endpoint = this.endpoint(channel);
        const token = this.accessToken(channel);
        const accountId = this.accountId(channel);
        const webhookSecret = this.webhookSecret(channel);
        return {
            channel,
            configured: Boolean(endpoint &&
                token &&
                accountId),
            endpointConfigured: Boolean(endpoint),
            tokenConfigured: Boolean(token),
            accountConfigured: Boolean(accountId),
            webhookSecretConfigured: Boolean(webhookSecret),
        };
    }
    allSnapshots() {
        return [
            this.snapshot("instagram"),
            this.snapshot("tiktok"),
            this.snapshot("google_search"),
        ];
    }
    endpoint(channel) {
        return this.value(channel === "instagram"
            ? process.env.INSTAGRAM_DELIVERY_URL
            : channel === "tiktok"
                ? process.env.TIKTOK_DELIVERY_URL
                : process.env.GOOGLE_SEARCH_DELIVERY_URL);
    }
    accessToken(channel) {
        return this.value(channel === "instagram"
            ? process.env.INSTAGRAM_ACCESS_TOKEN
            : channel === "tiktok"
                ? process.env.TIKTOK_ACCESS_TOKEN
                : process.env.GOOGLE_ADS_ACCESS_TOKEN);
    }
    accountId(channel) {
        return this.value(channel === "instagram"
            ? process.env.INSTAGRAM_ACCOUNT_ID
            : channel === "tiktok"
                ? process.env.TIKTOK_ACCOUNT_ID
                : process.env.GOOGLE_ADS_CUSTOMER_ID);
    }
    webhookSecret(channel) {
        return this.value(channel === "instagram"
            ? process.env.INSTAGRAM_WEBHOOK_SECRET
            : channel === "tiktok"
                ? process.env.TIKTOK_WEBHOOK_SECRET
                : process.env.GOOGLE_WEBHOOK_SECRET);
    }
    requireAccessToken(channel) {
        const token = this.accessToken(channel);
        if (!token) {
            throw new Error(`${channel} access token is not configured.`);
        }
        return token;
    }
    requireAccountId(channel) {
        const accountId = this.accountId(channel);
        if (!accountId) {
            throw new Error(`${channel} account id is not configured.`);
        }
        return accountId;
    }
    value(value) {
        const normalized = value?.trim();
        return normalized
            ? normalized
            : null;
    }
};
exports.ConnectorCredentialVaultService = ConnectorCredentialVaultService;
exports.ConnectorCredentialVaultService = ConnectorCredentialVaultService = __decorate([
    (0, common_1.Injectable)()
], ConnectorCredentialVaultService);
//# sourceMappingURL=connector-credential-vault.service.js.map