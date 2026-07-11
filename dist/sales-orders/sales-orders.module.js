"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const sales_orders_controller_1 = require("./sales-orders.controller");
const sales_orders_service_1 = require("./sales-orders.service");
const sales_orders_repository_1 = require("./sales-orders.repository");
const sales_orders_mapper_1 = require("./sales-orders.mapper");
const sales_orders_serializer_1 = require("./sales-orders.serializer");
const sales_orders_policy_1 = require("./sales-orders.policy");
let SalesOrdersModule = class SalesOrdersModule {
};
exports.SalesOrdersModule = SalesOrdersModule;
exports.SalesOrdersModule = SalesOrdersModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            sales_orders_controller_1.SalesOrdersController
        ],
        providers: [
            sales_orders_service_1.SalesOrdersService,
            sales_orders_repository_1.SalesOrdersRepository,
            sales_orders_mapper_1.SalesOrdersMapper,
            sales_orders_serializer_1.SalesOrdersSerializer,
            sales_orders_policy_1.SalesOrdersPolicy
        ],
        exports: [
            sales_orders_service_1.SalesOrdersService
        ]
    })
], SalesOrdersModule);
//# sourceMappingURL=sales-orders.module.js.map