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
exports.SalesOrdersService = void 0;
const common_1 = require("@nestjs/common");
const sales_orders_repository_1 = require("./sales-orders.repository");
const sales_orders_mapper_1 = require("./sales-orders.mapper");
const sales_orders_serializer_1 = require("./sales-orders.serializer");
let SalesOrdersService = class SalesOrdersService {
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
            throw new common_1.NotFoundException("Sales order not found");
        }
        return this.serializer.serialize(item);
    }
    async create(dto) {
        const item = await this.repo.create(this.mapper.toCreateData(dto));
        return this.serializer.serialize(item);
    }
};
exports.SalesOrdersService = SalesOrdersService;
exports.SalesOrdersService = SalesOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sales_orders_repository_1.SalesOrdersRepository,
        sales_orders_mapper_1.SalesOrdersMapper,
        sales_orders_serializer_1.SalesOrdersSerializer])
], SalesOrdersService);
//# sourceMappingURL=sales-orders.service.js.map