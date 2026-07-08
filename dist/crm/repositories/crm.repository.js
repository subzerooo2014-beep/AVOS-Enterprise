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
exports.CrmRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CrmRepository = class CrmRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    delegate() {
        const client = this.prisma;
        if (!client.crm) {
            throw new common_1.BadRequestException("Prisma delegate 'crm' is not available. Add CRM model and run pnpm prisma generate.");
        }
        return client.crm;
    }
    findAll(query = {}) {
        return this.delegate().findMany(query);
    }
    findOne(id) {
        return this.delegate().findUnique({ where: { id } });
    }
    create(data) {
        return this.delegate().create({ data });
    }
    update(id, data) {
        return this.delegate().update({ where: { id }, data });
    }
    delete(id) {
        return this.delegate().delete({ where: { id } });
    }
    count(args = {}) {
        return this.delegate().count(args);
    }
};
exports.CrmRepository = CrmRepository;
exports.CrmRepository = CrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmRepository);
//# sourceMappingURL=crm.repository.js.map