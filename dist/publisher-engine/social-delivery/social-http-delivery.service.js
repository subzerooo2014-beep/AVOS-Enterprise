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
var SocialHttpDeliveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialHttpDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const external_delivery_service_1 = require("../external-connectors/external-delivery.service");
let SocialHttpDeliveryService = SocialHttpDeliveryService_1 = class SocialHttpDeliveryService {
    constructor(externalDelivery) {
        this.externalDelivery = externalDelivery;
        this.logger = new common_1.Logger(SocialHttpDeliveryService_1.name);
    }
    async deliver(input) {
        const completedAt = new Date();
        const result = await this.externalDelivery.deliver({
            channel: input.channel,
            eventId: input.eventId,
            payload: input.payload,
            attempt: input.attempt,
        });
        if (result.status ===
            "awaiting_credentials") {
            return {
                success: false,
                channel: input.channel,
                eventId: input.eventId,
                status: "awaiting_credentials",
                attempt: input.attempt,
                message: result.message,
                response: result.response,
                completedAt,
            };
        }
        if (!result.success) {
            this.logger.warn(`Connector delivery failed: channel=${input.channel}, eventId=${input.eventId}, error=${result.message}`);
            return {
                success: false,
                channel: input.channel,
                eventId: input.eventId,
                status: "retrying",
                attempt: input.attempt,
                message: result.message,
                response: result.response,
                completedAt,
            };
        }
        return {
            success: true,
            channel: input.channel,
            eventId: input.eventId,
            status: "delivered",
            attempt: input.attempt,
            externalId: result.externalId ??
                null,
            message: result.message,
            response: result.response,
            completedAt,
        };
    }
};
exports.SocialHttpDeliveryService = SocialHttpDeliveryService;
exports.SocialHttpDeliveryService = SocialHttpDeliveryService = SocialHttpDeliveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [external_delivery_service_1.ExternalDeliveryService])
], SocialHttpDeliveryService);
//# sourceMappingURL=social-http-delivery.service.js.map