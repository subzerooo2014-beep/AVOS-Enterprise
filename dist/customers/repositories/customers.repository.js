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
exports.CustomersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let CustomersRepository = class CustomersRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma);
    }
    findCustomers(where = {}) {
        return this.prisma.customer.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    }
    paginateCustomers(page = 1, limit = 20, where = {}) {
        return this.paginate(this.prisma.customer, { where }, page, limit);
    }
    findCustomerById(id) {
        return this.prisma.customer.findUnique({
            where: { id },
        });
    }
    createCustomer(data) {
        return this.prisma.customer.create({
            data,
        });
    }
    updateCustomer(id, data) {
        return this.prisma.customer.update({
            where: { id },
            data,
        });
    }
    deleteCustomer(id) {
        return this.prisma.customer.delete({
            where: { id },
        });
    }
    countCustomers(where = {}) {
        return this.prisma.customer.count({
            where,
        });
    }
};
exports.CustomersRepository = CustomersRepository;
exports.CustomersRepository = CustomersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersRepository);
//# sourceMappingURL=customers.repository.js.map