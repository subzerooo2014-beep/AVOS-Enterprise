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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorWebhookVerificationService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const connector_credential_vault_service_1 = require("./connector-credential-vault.service");
let ConnectorWebhookVerificationService = class ConnectorWebhookVerificationService {
    constructor(vault) {
        this.vault = vault;
    }
    verify(input) {
        const secret = this.vault.webhookSecret(input.channel);
        if (!secret) {
            return {
                valid: false,
                configured: false,
                reason: `${input.channel} webhook secret is not configured.`,
            };
        }
        const supplied = this.normalizeSignature(input.signature);
        if (!supplied) {
            return {
                valid: false,
                configured: true,
                reason: "Webhook signature is missing.",
            };
        }
        const expected = (0, node_crypto_1.createHmac)("sha256", secret)
            .update(input.rawBody, "utf8")
            .digest("hex");
        const suppliedBuffer = Buffer.from(supplied, "hex");
        const expectedBuffer = Buffer.from(expected, "hex");
        const valid = suppliedBuffer.length ===
            expectedBuffer.length &&
            (0, node_crypto_1.timingSafeEqual)(suppliedBuffer, expectedBuffer);
        return {
            valid,
            configured: true,
            algorithm: "hmac-sha256",
            reason: valid
                ? "Webhook signature verified."
                : "Webhook signature is invalid.",
        };
    }
    normalizeSignature(value) {
        if (typeof value !== "string" ||
            !value.trim()) {
            return null;
        }
        const normalized = value
            .trim()
            .replace(/^sha256=/i, "");
        return /^[a-f0-9]{64}$/i.test(normalized)
            ? normalized.toLowerCase()
            : null;
    }
};
exports.ConnectorWebhookVerificationService = ConnectorWebhookVerificationService;
exports.ConnectorWebhookVerificationService = ConnectorWebhookVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [connector_credential_vault_service_1.ConnectorCredentialVaultService])
], ConnectorWebhookVerificationService);
//# sourceMappingURL=connector-webhook-verification.service.js.map