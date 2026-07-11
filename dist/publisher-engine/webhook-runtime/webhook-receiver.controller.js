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
exports.WebhookReceiverController = void 0;
const common_1 = require("@nestjs/common");
const webhook_receipt_service_1 = require("./webhook-receipt.service");
let WebhookReceiverController = class WebhookReceiverController {
    constructor(receipt) {
        this.receipt = receipt;
    }
    receive(channel, body, signature, headerReceiptId) {
        const normalizedChannel = this.channel(channel);
        const receiptId = body?.receiptId ??
            headerReceiptId ??
            null;
        const rawBody = JSON.stringify(body ?? {});
        return this.receipt.receive({
            ...body,
            channel: normalizedChannel,
            receiptId,
            rawBody,
            signature: signature ?? "",
            receivedAt: new Date(),
        });
    }
    channel(value) {
        const normalized = String(value)
            .trim()
            .toLowerCase();
        if (normalized ===
            "instagram" ||
            normalized ===
                "tiktok" ||
            normalized ===
                "google_search") {
            return normalized;
        }
        if (normalized ===
            "google-search") {
            return "google_search";
        }
        throw new Error(`Unsupported webhook channel "${normalized}".`);
    }
};
exports.WebhookReceiverController = WebhookReceiverController;
__decorate([
    (0, common_1.Post)(":channel"),
    __param(0, (0, common_1.Param)("channel")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)("x-avos-signature")),
    __param(3, (0, common_1.Headers)("x-avos-receipt-id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", void 0)
], WebhookReceiverController.prototype, "receive", null);
exports.WebhookReceiverController = WebhookReceiverController = __decorate([
    (0, common_1.Controller)("publisher-engine/webhook"),
    __metadata("design:paramtypes", [webhook_receipt_service_1.WebhookReceiptService])
], WebhookReceiverController);
//# sourceMappingURL=webhook-receiver.controller.js.map