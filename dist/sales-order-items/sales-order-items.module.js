"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderItemsModule = void 0;
const common_1 = require("@nestjs/common");
const sales_order_items_controller_1 = require("./sales-order-items.controller");
const sales_order_items_service_1 = require("./sales-order-items.service");
const sales_order_items_repository_1 = require("./sales-order-items.repository");
const sales_order_items_mapper_1 = require("./sales-order-items.mapper");
let SalesOrderItemsModule = class SalesOrderItemsModule {
};
exports.SalesOrderItemsModule = SalesOrderItemsModule;
exports.SalesOrderItemsModule = SalesOrderItemsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            sales_order_items_controller_1.SalesOrderItemsController
        ],
        providers: [
            sales_order_items_service_1.SalesOrderItemsService,
            sales_order_items_repository_1.SalesOrderItemsRepository,
            sales_order_items_mapper_1.SalesOrderItemsMapper
        ],
        exports: [
            sales_order_items_service_1.SalesOrderItemsService
        ]
    })
], SalesOrderItemsModule);
//# sourceMappingURL=sales-order-items.module.js.map