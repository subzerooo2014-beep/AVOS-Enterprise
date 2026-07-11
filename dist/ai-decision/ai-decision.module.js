"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiDecisionModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_results_module_1 = require("../ai-results/ai-results.module");
const ai_decision_history_module_1 = require("../ai-decision-history/ai-decision-history.module");
const ai_decision_controller_1 = require("./ai-decision.controller");
const ai_decision_service_1 = require("./ai-decision.service");
let AiDecisionModule = class AiDecisionModule {
};
exports.AiDecisionModule = AiDecisionModule;
exports.AiDecisionModule = AiDecisionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            ai_results_module_1.AiResultsModule,
            ai_decision_history_module_1.AiDecisionHistoryModule,
        ],
        controllers: [
            ai_decision_controller_1.AiDecisionController,
        ],
        providers: [
            ai_decision_service_1.AiDecisionService,
        ],
        exports: [
            ai_decision_service_1.AiDecisionService,
        ],
    })
], AiDecisionModule);
//# sourceMappingURL=ai-decision.module.js.map