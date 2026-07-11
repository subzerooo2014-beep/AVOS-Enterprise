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
exports.CommandBusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CommandBusService = class CommandBusService {
    constructor(prisma) {
        this.prisma = prisma;
        this.handlers = [];
    }
    register(handler) {
        this.handlers.push(handler);
    }
    async execute(command) {
        if (!command?.type) {
            throw new common_1.BadRequestException("Command type is required");
        }
        await this.logCommand(command, "received");
        const handler = this.handlers.find((h) => h.supports(command));
        if (!handler) {
            await this.logCommand(command, "no_handler");
            return {
                status: "no_handler",
                commandType: command.type,
                message: "No handler registered for this command yet.",
            };
        }
        try {
            const result = await handler.handle(command);
            await this.logCommand(command, "completed", result);
            return result;
        }
        catch (error) {
            await this.logCommand(command, "failed", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async logCommand(command, status, result = {}) {
        try {
            await this.prisma.platformEvent.create({
                data: {
                    type: `Command:${command.type}`,
                    source: command.source || "command-bus",
                    entityType: command.metadata?.entityType,
                    entityId: command.metadata?.entityId,
                    status,
                    payload: command.payload || {},
                    result: {
                        correlationId: command.correlationId || null,
                        metadata: command.metadata || {},
                        ...result,
                    },
                },
            });
        }
        catch (error) {
            console.error("Command log failed:", error instanceof Error ? error.message : String(error));
        }
    }
};
exports.CommandBusService = CommandBusService;
exports.CommandBusService = CommandBusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommandBusService);
//# sourceMappingURL=command-bus.service.js.map