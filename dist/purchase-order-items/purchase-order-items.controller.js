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
exports.PurchaseOrderItemsController = void 0;
const common_1 = require("@nestjs/common");
const purchase_order_items_service_1 = require("./purchase-order-items.service");
let PurchaseOrderItemsController = class PurchaseOrderItemsController {
    constructor(service) {
        this.service = service;
    }
    findAll(orderId) {
        return this.service.findAll(orderId);
    }
    create(dto) {
        return this.service.create(dto);
    }
};
exports.PurchaseOrderItemsController = PurchaseOrderItemsController;
__decorate([
    (0, common_1.Get)(":orderId"),
    __param(0, (0, common_1.Param)("orderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderItemsController.prototype, "create", null);
exports.PurchaseOrderItemsController = PurchaseOrderItemsController = __decorate([
    (0, common_1.Controller)("purchase-order-items"),
    __metadata("design:paramtypes", [purchase_order_items_service_1.PurchaseOrderItemsService])
], PurchaseOrderItemsController);
//# sourceMappingURL=purchase-order-items.controller.js.map