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
exports.BaseRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_util_1 = require("../pagination/pagination.util");
let BaseRepository = class BaseRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async paginate(model, args = {}, page = 1, limit = 20) {
        const p = (0, pagination_util_1.buildPagination)(page, limit);
        const [data, total] = await Promise.all([
            model.findMany({
                ...args,
                skip: p.skip,
                take: p.take,
            }),
            model.count({
                where: args.where,
            }),
        ]);
        return {
            data,
            page: p.page,
            limit: p.limit,
            total,
            totalPages: Math.ceil(total / p.limit),
        };
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BaseRepository);
//# sourceMappingURL=base.repository.js.map