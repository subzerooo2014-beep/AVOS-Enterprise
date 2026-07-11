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
exports.SalesOrderItemsService = void 0;
const common_1 = require("@nestjs/common");
const sales_order_items_repository_1 = require("./sales-order-items.repository");
const sales_order_items_mapper_1 = require("./sales-order-items.mapper");
let SalesOrderItemsService = class SalesOrderItemsService {
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
exports.SalesOrderItemsService = SalesOrderItemsService;
exports.SalesOrderItemsService = SalesOrderItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sales_order_items_repository_1.SalesOrderItemsRepository,
        sales_order_items_mapper_1.SalesOrderItemsMapper])
], SalesOrderItemsService);
//# sourceMappingURL=sales-order-items.service.js.map