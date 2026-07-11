"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryTransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_transactions_controller_1 = require("./inventory-transactions.controller");
const inventory_transactions_service_1 = require("./inventory-transactions.service");
const inventory_transactions_repository_1 = require("./inventory-transactions.repository");
const inventory_transactions_mapper_1 = require("./inventory-transactions.mapper");
const inventory_transactions_serializer_1 = require("./inventory-transactions.serializer");
const inventory_transactions_policy_1 = require("./inventory-transactions.policy");
let InventoryTransactionsModule = class InventoryTransactionsModule {
};
exports.InventoryTransactionsModule = InventoryTransactionsModule;
exports.InventoryTransactionsModule = InventoryTransactionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            inventory_transactions_controller_1.InventoryTransactionsController
        ],
        providers: [
            inventory_transactions_service_1.InventoryTransactionsService,
            inventory_transactions_repository_1.InventoryTransactionsRepository,
            inventory_transactions_mapper_1.InventoryTransactionsMapper,
            inventory_transactions_serializer_1.InventoryTransactionsSerializer,
            inventory_transactions_policy_1.InventoryTransactionsPolicy
        ],
        exports: [
            inventory_transactions_service_1.InventoryTransactionsService
        ]
    })
], InventoryTransactionsModule);
//# sourceMappingURL=inventory-transactions.module.js.map