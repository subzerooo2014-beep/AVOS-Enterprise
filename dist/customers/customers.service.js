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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const customers_repository_1 = require("./repositories/customers.repository");
const customers_mapper_1 = require("./mappers/customers.mapper");
const customers_serializer_1 = require("./serializers/customers.serializer");
let CustomersService = class CustomersService {
    constructor(customersRepository) {
        this.customersRepository = customersRepository;
    }
    async findAll() {
        const items = await this.customersRepository.findCustomers();
        return customers_serializer_1.CustomersSerializer.serializeMany(items);
    }
    async paginate(page = 1, limit = 20, where = {}) {
        const result = await this.customersRepository.paginateCustomers(page, limit, where);
        return customers_serializer_1.CustomersSerializer.serializePagination(result);
    }
    async findOne(id) {
        const item = await this.customersRepository.findCustomerById(id);
        if (!item)
            throw new common_1.NotFoundException("Customer item not found");
        return customers_serializer_1.CustomersSerializer.serialize(item);
    }
    async create(dto) {
        const data = customers_mapper_1.CustomersMapper.toCreate(dto);
        const item = await this.customersRepository.createCustomer(data);
        return customers_serializer_1.CustomersSerializer.serialize(item);
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = customers_mapper_1.CustomersMapper.toUpdate(dto);
        const item = await this.customersRepository.updateCustomer(id, data);
        return customers_serializer_1.CustomersSerializer.serialize(item);
    }
    async remove(id) {
        await this.findOne(id);
        await this.customersRepository.deleteCustomer(id);
        return { deleted: true };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customers_repository_1.CustomersRepository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map