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
exports.PersistentAuditRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PersistentAuditRepository = class PersistentAuditRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get model() {
        return this.prisma.persistentAuditEvent;
    }
    findLatest() {
        return this.model.findFirst({
            orderBy: {
                sequence: "desc",
            },
        });
    }
    findFirst() {
        return this.model.findFirst({
            orderBy: {
                sequence: "asc",
            },
        });
    }
    findById(id) {
        return this.model.findUnique({
            where: { id },
        });
    }
    findBySequence(sequence) {
        return this.model.findUnique({
            where: { sequence },
        });
    }
    findMany(input) {
        const where = {};
        if (input.eventType) {
            where.eventType = input.eventType;
        }
        if (input.severity) {
            where.severity = input.severity;
        }
        if (input.actor) {
            where.actor = input.actor;
        }
        if (input.correlationId) {
            where.correlationId = input.correlationId;
        }
        return this.model.findMany({
            where,
            orderBy: {
                sequence: "desc",
            },
            take: input.limit,
        });
    }
    findAllAscending() {
        return this.model.findMany({
            orderBy: {
                sequence: "asc",
            },
        });
    }
    count() {
        return this.model.count();
    }
    create(data) {
        return this.model.create({
            data,
        });
    }
    getSeverityCounts() {
        return this.model.groupBy({
            by: ["severity"],
            _count: {
                _all: true,
            },
        });
    }
    getTypeCounts() {
        return this.model.groupBy({
            by: ["eventType"],
            _count: {
                _all: true,
            },
        });
    }
};
exports.PersistentAuditRepository = PersistentAuditRepository;
exports.PersistentAuditRepository = PersistentAuditRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PersistentAuditRepository);
//# sourceMappingURL=persistent-audit.repository.js.map