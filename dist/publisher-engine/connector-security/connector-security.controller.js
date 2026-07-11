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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorSecurityController = void 0;
const common_1 = require("@nestjs/common");
const connector_credential_vault_service_1 = require("./connector-credential-vault.service");
const connector_oauth_state_service_1 = require("./connector-oauth-state.service");
const connector_rate_limiter_service_1 = require("./connector-rate-limiter.service");
const connector_webhook_verification_service_1 = require("./connector-webhook-verification.service");
let ConnectorSecurityController = class ConnectorSecurityController {
    constructor(vault, oauthStates, rateLimiter, webhooks) {
        this.vault = vault;
        this.oauthStates = oauthStates;
        this.rateLimiter = rateLimiter;
        this.webhooks = webhooks;
    }
    status() {
        const credentials = this.vault.allSnapshots();
        return {
            success: true,
            credentials,
            configuredCount: credentials.filter((item) => item.configured).length,
            oauth: this.oauthStates.status(),
            rateLimiter: this.rateLimiter.status(),
            generatedAt: new Date(),
        };
    }
    createOAuthState(channel, body) {
        const normalized = this.channel(channel);
        if (!body?.redirectUri?.trim()) {
            throw new Error("redirectUri is required.");
        }
        return this.oauthStates.create({
            channel: normalized,
            redirectUri: body.redirectUri.trim(),
        });
    }
    consumeOAuthState(channel, body) {
        if (!body?.state?.trim()) {
            throw new Error("state is required.");
        }
        return this.oauthStates.consume(body.state.trim(), this.channel(channel));
    }
    rateLimit(channel, body) {
        return this.rateLimiter.consume(this.channel(channel), body?.identity?.trim() ||
            "global");
    }
    verifyWebhook(channel, body) {
        return this.webhooks.verify({
            channel: this.channel(channel),
            rawBody: body?.rawBody ?? "",
            signature: body?.signature ?? "",
        });
    }
    channel(value) {
        const normalized = String(value)
            .trim()
            .toLowerCase();
        if (normalized === "instagram" ||
            normalized === "tiktok" ||
            normalized === "google_search") {
            return normalized;
        }
        if (normalized ===
            "google-search") {
            return "google_search";
        }
        throw new Error(`Unsupported connector channel "${normalized}".`);
    }
};
exports.ConnectorSecurityController = ConnectorSecurityController;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConnectorSecurityController.prototype, "status", null);
__decorate([
    (0, common_1.Post)("oauth/state/:channel"),
    __param(0, (0, common_1.Param)("channel")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectorSecurityController.prototype, "createOAuthState", null);
__decorate([
    (0, common_1.Post)("oauth/consume/:channel"),
    __param(0, (0, common_1.Param)("channel")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectorSecurityController.prototype, "consumeOAuthState", null);
__decorate([
    (0, common_1.Post)("rate-limit/:channel"),
    __param(0, (0, common_1.Param)("channel")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectorSecurityController.prototype, "rateLimit", null);
__decorate([
    (0, common_1.Post)("webhook/verify/:channel"),
    __param(0, (0, common_1.Param)("channel")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectorSecurityController.prototype, "verifyWebhook", null);
exports.ConnectorSecurityController = ConnectorSecurityController = __decorate([
    (0, common_1.Controller)("publisher-engine/connector-security"),
    __metadata("design:paramtypes", [connector_credential_vault_service_1.ConnectorCredentialVaultService,
        connector_oauth_state_service_1.ConnectorOAuthStateService,
        connector_rate_limiter_service_1.ConnectorRateLimiterService,
        connector_webhook_verification_service_1.ConnectorWebhookVerificationService])
], ConnectorSecurityController);
//# sourceMappingURL=connector-security.controller.js.map