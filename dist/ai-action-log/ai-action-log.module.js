"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiActionLogModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_action_log_controller_1 = require("./ai-action-log.controller");
const ai_action_log_service_1 = require("./ai-action-log.service");
let AiActionLogModule = class AiActionLogModule {
};
exports.AiActionLogModule = AiActionLogModule;
exports.AiActionLogModule = AiActionLogModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [ai_action_log_controller_1.AiActionLogController],
        providers: [ai_action_log_service_1.AiActionLogService],
        exports: [ai_action_log_service_1.AiActionLogService],
    })
], AiActionLogModule);
//# sourceMappingURL=ai-action-log.module.js.map