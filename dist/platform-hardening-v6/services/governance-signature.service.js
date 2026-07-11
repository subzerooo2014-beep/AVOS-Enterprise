"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceSignatureService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let GovernanceSignatureService = class GovernanceSignatureService {
    constructor() {
        this.algorithm = "HMAC-SHA256";
        this.keyId = process.env.AVOS_GOVERNANCE_SIGNING_KEY_ID ??
            "avos-governance-key-v1";
        this.signingSecret = process.env.AVOS_GOVERNANCE_SIGNING_SECRET ??
            "avos-dev-governance-signing-secret-change-in-production";
    }
    signPayload(payload) {
        const signedAt = new Date().toISOString();
        const signature = this.createSignature(payload, signedAt);
        return {
            signature,
            algorithm: this.algorithm,
            keyId: this.keyId,
            signedAt,
        };
    }
    verifyPayload(input) {
        if (input.algorithm !== this.algorithm ||
            input.keyId !== this.keyId) {
            return false;
        }
        const signedAt = input.signedAt instanceof Date
            ? input.signedAt.toISOString()
            : input.signedAt;
        const expected = this.createSignature(input.payload, signedAt);
        const actualBuffer = Buffer.from(input.signature, "hex");
        const expectedBuffer = Buffer.from(expected, "hex");
        if (actualBuffer.length !==
            expectedBuffer.length) {
            return false;
        }
        return (0, node_crypto_1.timingSafeEqual)(actualBuffer, expectedBuffer);
    }
    getConfiguration() {
        return {
            algorithm: this.algorithm,
            keyId: this.keyId,
            secretConfigured: Boolean(this.signingSecret),
        };
    }
    createSignature(payload, signedAt) {
        return (0, node_crypto_1.createHmac)("sha256", this.signingSecret)
            .update(JSON.stringify({
            payload,
            signedAt,
            keyId: this.keyId,
            algorithm: this.algorithm,
        }))
            .digest("hex");
    }
};
exports.GovernanceSignatureService = GovernanceSignatureService;
exports.GovernanceSignatureService = GovernanceSignatureService = __decorate([
    (0, common_1.Injectable)()
], GovernanceSignatureService);
//# sourceMappingURL=governance-signature.service.js.map