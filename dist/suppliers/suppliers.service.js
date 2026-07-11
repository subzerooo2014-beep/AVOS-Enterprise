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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const suppliers_repository_1 = require("./suppliers.repository");
const suppliers_mapper_1 = require("./suppliers.mapper");
const suppliers_serializer_1 = require("./suppliers.serializer");
const suppliers_constants_1 = require("./constants/suppliers.constants");
let SuppliersService = class SuppliersService {
    constructor(repo, mapper, serializer) {
        this.repo = repo;
        this.mapper = mapper;
        this.serializer = serializer;
    }
    async findAll() {
        const items = await this.repo.findAll();
        return this.serializer.serializeMany(items);
    }
    async findOne(id) {
        const item = await this.repo.findById(id);
        if (!item)
            throw new common_1.NotFoundException(suppliers_constants_1.SUPPLIERS_MESSAGES.NOT_FOUND);
        return this.serializer.serialize(item);
    }
    async create(dto) {
        const item = await this.repo.create(this.mapper.toCreateData(dto));
        return this.serializer.serialize(item);
    }
    async update(id, dto) {
        await this.findOne(id);
        const item = await this.repo.update(id, this.mapper.toUpdateData(dto));
        return this.serializer.serialize(item);
    }
    async remove(id) {
        await this.findOne(id);
        return this.repo.remove(id);
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [suppliers_repository_1.SuppliersRepository,
        suppliers_mapper_1.SuppliersMapper,
        suppliers_serializer_1.SuppliersSerializer])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map