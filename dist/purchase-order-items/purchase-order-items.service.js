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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderItemsService = void 0;
const common_1 = require("@nestjs/common");
const purchase_order_items_repository_1 = require("./purchase-order-items.repository");
const purchase_order_items_mapper_1 = require("./purchase-order-items.mapper");
let PurchaseOrderItemsService = class PurchaseOrderItemsService {
    constructor(repo, mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }
    findAll(orderId) {
        return this.repo.findAll(orderId);
    }
    create(dto) {
        return this.repo.create(this.mapper.toCreateData(dto));
    }
};
exports.PurchaseOrderItemsService = PurchaseOrderItemsService;
exports.PurchaseOrderItemsService = PurchaseOrderItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [purchase_order_items_repository_1.PurchaseOrderItemsRepository,
        purchase_order_items_mapper_1.PurchaseOrderItemsMapper])
], PurchaseOrderItemsService);
//# sourceMappingURL=purchase-order-items.service.js.map