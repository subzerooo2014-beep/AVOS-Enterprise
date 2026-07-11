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
exports.QueryBusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let QueryBusService = class QueryBusService {
    constructor(prisma) {
        this.prisma = prisma;
        this.handlers = [];
    }
    register(handler) {
        this.handlers.push(handler);
    }
    async execute(query) {
        if (!query?.type) {
            throw new common_1.BadRequestException("Query type is required");
        }
        await this.logQuery(query, "received");
        const handler = this.handlers.find((h) => h.supports(query));
        if (!handler) {
            await this.logQuery(query, "no_handler");
            return {
                status: "no_handler",
                queryType: query.type,
                message: "No handler registered for this query yet.",
            };
        }
        try {
            const result = await handler.handle(query);
            await this.logQuery(query, "completed", { count: Array.isArray(result) ? result.length : 1 });
            return result;
        }
        catch (error) {
            await this.logQuery(query, "failed", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async logQuery(query, status, result = {}) {
        try {
            await this.prisma.platformEvent.create({
                data: {
                    type: `Query:${query.type}`,
                    source: query.source || "query-bus",
                    entityType: query.metadata?.entityType,
                    entityId: query.metadata?.entityId,
                    status,
                    payload: query.filters || {},
                    result: {
                        correlationId: query.correlationId || null,
                        metadata: query.metadata || {},
                        ...result,
                    },
                },
            });
        }
        catch (error) {
            console.error("Query log failed:", error instanceof Error ? error.message : String(error));
        }
    }
};
exports.QueryBusService = QueryBusService;
exports.QueryBusService = QueryBusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueryBusService);
//# sourceMappingURL=query-bus.service.js.map