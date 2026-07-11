"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderItemsModule = void 0;
const common_1 = require("@nestjs/common");
const purchase_order_items_controller_1 = require("./purchase-order-items.controller");
const purchase_order_items_service_1 = require("./purchase-order-items.service");
const purchase_order_items_repository_1 = require("./purchase-order-items.repository");
const purchase_order_items_mapper_1 = require("./purchase-order-items.mapper");
let PurchaseOrderItemsModule = class PurchaseOrderItemsModule {
};
exports.PurchaseOrderItemsModule = PurchaseOrderItemsModule;
exports.PurchaseOrderItemsModule = PurchaseOrderItemsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            purchase_order_items_controller_1.PurchaseOrderItemsController
        ],
        providers: [
            purchase_order_items_service_1.PurchaseOrderItemsService,
            purchase_order_items_repository_1.PurchaseOrderItemsRepository,
            purchase_order_items_mapper_1.PurchaseOrderItemsMapper
        ],
        exports: [
            purchase_order_items_service_1.PurchaseOrderItemsService
        ]
    })
], PurchaseOrderItemsModule);
//# sourceMappingURL=purchase-order-items.module.js.map