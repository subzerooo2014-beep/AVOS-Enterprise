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
exports.MockSocialDeliveryController = void 0;
const common_1 = require("@nestjs/common");
const mock_social_delivery_service_1 = require("./mock-social-delivery.service");
let MockSocialDeliveryController = class MockSocialDeliveryController {
    constructor(service) {
        this.service = service;
    }
    deliver(channel, body, headers) {
        return this.service.deliver(channel, body, headers);
    }
};
exports.MockSocialDeliveryController = MockSocialDeliveryController;
__decorate([
    (0, common_1.Post)(":channel"),
    __param(0, (0, common_1.Param)("channel")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], MockSocialDeliveryController.prototype, "deliver", null);
exports.MockSocialDeliveryController = MockSocialDeliveryController = __decorate([
    (0, common_1.Controller)("publisher-engine/mock-delivery"),
    __metadata("design:paramtypes", [mock_social_delivery_service_1.MockSocialDeliveryService])
], MockSocialDeliveryController);
//# sourceMappingURL=mock-social-delivery.controller.js.map