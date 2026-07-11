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
exports.InventoryTransactionsService = void 0;
const common_1 = require("@nestjs/common");
const inventory_transactions_repository_1 = require("./inventory-transactions.repository");
const inventory_transactions_mapper_1 = require("./inventory-transactions.mapper");
const inventory_transactions_serializer_1 = require("./inventory-transactions.serializer");
let InventoryTransactionsService = class InventoryTransactionsService {
    constructor(repo, mapper, serializer) {
        this.repo = repo;
        this.mapper = mapper;
        this.serializer = serializer;
    }
    async findAll() {
        return this.serializer.serializeMany(await this.repo.findAll());
    }
    async findOne(id) {
        const item = await this.repo.findOne(id);
        if (!item) {
            throw new common_1.NotFoundException("Inventory transaction not found");
        }
        return this.serializer.serialize(item);
    }
    async create(dto) {
        return this.serializer.serialize(await this.repo.create(this.mapper.toCreateData(dto)));
    }
};
exports.InventoryTransactionsService = InventoryTransactionsService;
exports.InventoryTransactionsService = InventoryTransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [inventory_transactions_repository_1.InventoryTransactionsRepository,
        inventory_transactions_mapper_1.InventoryTransactionsMapper,
        inventory_transactions_serializer_1.InventoryTransactionsSerializer])
], InventoryTransactionsService);
//# sourceMappingURL=inventory-transactions.service.js.map