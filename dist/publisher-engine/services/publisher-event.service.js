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
exports.PublisherEventService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherEventService = class PublisherEventService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(type, job, payload) {
        return this.prisma.platformEvent.create({
            data: {
                id: crypto.randomUUID(),
                type,
                source: "publisher-engine",
                entityType: "publish_job",
                entityId: job.id,
                status: "new",
                payload: payload ?? {},
                result: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
};
exports.PublisherEventService = PublisherEventService;
exports.PublisherEventService = PublisherEventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherEventService);
//# sourceMappingURL=publisher-event.service.js.map