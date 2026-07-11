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
var WebhookReceiptService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookReceiptService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const connector_webhook_verification_service_1 = require("../connector-security/connector-webhook-verification.service");
let WebhookReceiptService = WebhookReceiptService_1 = class WebhookReceiptService {
    constructor(prisma, verifier) {
        this.prisma = prisma;
        this.verifier = verifier;
        this.logger = new common_1.Logger(WebhookReceiptService_1.name);
    }
    async receive(input) {
        const eventId = this.requiredText(input.eventId, "eventId");
        const receiptId = this.requiredText(input.receiptId, "receiptId");
        this.verifySignatureIfRequired(input);
        const event = await this.prisma.platformEvent.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("PlatformEvent not found.");
        }
        const expectedChannel = this.channelFromEventType(event.type);
        if (!expectedChannel) {
            throw new common_1.BadRequestException(`PlatformEvent type "${event.type}" does not support social delivery receipts.`);
        }
        if (expectedChannel !== input.channel) {
            throw new common_1.BadRequestException(`Webhook channel mismatch. Event belongs to "${expectedChannel}", received "${input.channel}".`);
        }
        const previousResult = this.objectOf(event.result);
        const previousDelivery = this.objectOf(previousResult.delivery);
        const existingReceipts = Array.isArray(previousResult.receipts)
            ? previousResult.receipts
            : [];
        const duplicate = existingReceipts.find((item) => item?.receiptId ===
            receiptId);
        if (duplicate) {
            return {
                success: true,
                duplicate: true,
                eventId,
                receiptId,
                channel: input.channel,
                status: event.status,
                message: "Receipt was already processed.",
            };
        }
        const receiptStatus = this.resolveStatus(input);
        const receivedAt = input.receivedAt ??
            new Date();
        const receipt = {
            receiptId,
            eventId,
            channel: input.channel,
            status: receiptStatus,
            success: receiptStatus ===
                "delivered",
            externalId: this.optionalText(input.externalId),
            externalStatus: this.optionalText(input.externalStatus),
            errorCode: this.optionalText(input.errorCode),
            errorMessage: this.optionalText(input.errorMessage),
            message: this.optionalText(input.message),
            payload: input.payload ?? null,
            receivedAt: receivedAt.toISOString(),
        };
        const nextDelivery = {
            ...previousDelivery,
            channel: input.channel,
            status: receiptStatus,
            success: receiptStatus ===
                "delivered",
            externalId: receipt.externalId ??
                previousDelivery.externalId ??
                null,
            externalStatus: receipt.externalStatus,
            errorCode: receipt.errorCode,
            errorMessage: receipt.errorMessage,
            receiptId,
            webhookConfirmedAt: receivedAt.toISOString(),
        };
        const updated = await this.prisma.platformEvent.update({
            where: {
                id: eventId,
            },
            data: {
                status: receiptStatus,
                result: {
                    ...previousResult,
                    delivery: nextDelivery,
                    receipts: [
                        ...existingReceipts,
                        receipt,
                    ],
                    latestReceipt: receipt,
                },
                updatedAt: receivedAt,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: this.auditAction(receiptStatus),
                entity: "PlatformEvent",
                entityId: eventId,
            },
        });
        this.logger.log(`Webhook receipt processed: channel=${input.channel}, eventId=${eventId}, receiptId=${receiptId}, status=${receiptStatus}`);
        return {
            success: true,
            duplicate: false,
            eventId,
            receiptId,
            channel: input.channel,
            status: updated.status,
            externalId: receipt.externalId,
            receivedAt,
        };
    }
    verifySignatureIfRequired(input) {
        const required = String(process.env
            .WEBHOOK_SIGNATURE_REQUIRED ??
            (process.env
                .PUBLISHER_DELIVERY_MODE ===
                "production"
                ? "true"
                : "false")).toLowerCase() ===
            "true";
        if (!required) {
            return;
        }
        const verification = this.verifier.verify({
            channel: input.channel,
            rawBody: input.rawBody,
            signature: input.signature ?? "",
        });
        if (!verification.configured) {
            throw new common_1.ConflictException(verification.reason);
        }
        if (!verification.valid) {
            throw new common_1.UnauthorizedException(verification.reason);
        }
    }
    resolveStatus(input) {
        const supplied = String(input.status ??
            input.externalStatus ??
            "")
            .trim()
            .toLowerCase();
        switch (supplied) {
            case "delivered":
            case "published":
            case "completed":
            case "success":
            case "succeeded":
                return "delivered";
            case "rejected":
            case "declined":
                return "rejected";
            case "cancelled":
            case "canceled":
                return "cancelled";
            case "processing":
            case "pending":
                return "processing";
            case "failed":
            case "error":
                return "failed";
        }
        if (typeof input.success ===
            "boolean") {
            return input.success
                ? "delivered"
                : "failed";
        }
        throw new common_1.BadRequestException("Receipt must include a valid status or success flag.");
    }
    channelFromEventType(type) {
        switch (type) {
            case "InstagramVehiclePublicationRequested":
                return "instagram";
            case "TikTokVehiclePublicationRequested":
                return "tiktok";
            case "GoogleSearchVehicleCampaignRequested":
                return "google_search";
            default:
                return null;
        }
    }
    auditAction(status) {
        switch (status) {
            case "delivered":
                return "SOCIAL_DELIVERY_CONFIRMED";
            case "rejected":
                return "SOCIAL_DELIVERY_REJECTED";
            case "cancelled":
                return "SOCIAL_DELIVERY_CANCELLED";
            case "processing":
                return "SOCIAL_DELIVERY_PROCESSING";
            default:
                return "SOCIAL_DELIVERY_FAILED";
        }
    }
    requiredText(value, field) {
        if (typeof value !== "string" ||
            !value.trim()) {
            throw new common_1.BadRequestException(`${field} is required.`);
        }
        return value.trim();
    }
    optionalText(value) {
        if (typeof value !== "string") {
            return null;
        }
        const normalized = value.trim();
        return normalized
            ? normalized
            : null;
    }
    objectOf(value) {
        if (value &&
            typeof value === "object" &&
            !Array.isArray(value)) {
            return value;
        }
        return {};
    }
};
exports.WebhookReceiptService = WebhookReceiptService;
exports.WebhookReceiptService = WebhookReceiptService = WebhookReceiptService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        connector_webhook_verification_service_1.ConnectorWebhookVerificationService])
], WebhookReceiptService);
//# sourceMappingURL=webhook-receipt.service.js.map