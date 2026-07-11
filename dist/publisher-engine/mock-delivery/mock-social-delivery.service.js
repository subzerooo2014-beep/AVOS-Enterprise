"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MockSocialDeliveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSocialDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let MockSocialDeliveryService = MockSocialDeliveryService_1 = class MockSocialDeliveryService {
    constructor() {
        this.logger = new common_1.Logger(MockSocialDeliveryService_1.name);
    }
    deliver(channel, body, headers) {
        const normalizedChannel = String(channel)
            .trim()
            .toLowerCase();
        const supported = [
            "instagram",
            "tiktok",
            "google-search",
            "google_search",
        ];
        if (!supported.includes(normalizedChannel)) {
            throw new Error(`Unsupported mock delivery channel "${normalizedChannel}".`);
        }
        const canonicalChannel = normalizedChannel === "google-search"
            ? "google_search"
            : normalizedChannel;
        const eventId = body?.eventId ??
            headers["x-avos-event-id"] ??
            null;
        const externalId = `mock-${canonicalChannel}-${(0, node_crypto_1.randomUUID)()}`;
        this.logger.log(`Mock social delivery completed: channel=${canonicalChannel}, eventId=${String(eventId ?? "unknown")}, externalId=${externalId}`);
        return {
            success: true,
            delivered: true,
            mock: true,
            channel: canonicalChannel,
            externalId,
            eventId,
            received: {
                accountId: body?.accountId ??
                    body?.customerId ??
                    null,
                attempt: body?.attempt ??
                    headers["x-avos-attempt"] ??
                    null,
                hasPayload: Boolean(body?.payload),
                hasPublication: Boolean(body?.publication),
                hasCampaign: Boolean(body?.campaign),
                vehicleId: body?.vehicle?.id ??
                    body?.payload?.vehicle?.id ??
                    null,
            },
            deliveredAt: new Date().toISOString(),
        };
    }
};
exports.MockSocialDeliveryService = MockSocialDeliveryService;
exports.MockSocialDeliveryService = MockSocialDeliveryService = MockSocialDeliveryService_1 = __decorate([
    (0, common_1.Injectable)()
], MockSocialDeliveryService);
//# sourceMappingURL=mock-social-delivery.service.js.map