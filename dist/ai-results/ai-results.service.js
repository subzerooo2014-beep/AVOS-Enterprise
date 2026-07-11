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
exports.AiResultsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiResultsService = class AiResultsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVehicleResults(vehicleId) {
        return this.prisma.brainTask.findMany({
            where: {
                entityType: "vehicle",
                entityId: vehicleId,
                status: "completed",
            },
            orderBy: {
                createdAt: "asc",
            },
            select: {
                taskType: true,
                output: true,
                updatedAt: true,
            },
        });
    }
};
exports.AiResultsService = AiResultsService;
exports.AiResultsService = AiResultsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiResultsService);
//# sourceMappingURL=ai-results.service.js.map