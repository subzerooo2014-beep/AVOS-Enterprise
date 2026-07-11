"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCampaignEngineModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_decision_module_1 = require("../ai-decision/ai-decision.module");
const publish_jobs_module_1 = require("../publish-jobs/publish-jobs.module");
const ai_action_log_module_1 = require("../ai-action-log/ai-action-log.module");
const ai_campaign_engine_controller_1 = require("./ai-campaign-engine.controller");
const ai_campaign_engine_service_1 = require("./ai-campaign-engine.service");
let AiCampaignEngineModule = class AiCampaignEngineModule {
};
exports.AiCampaignEngineModule = AiCampaignEngineModule;
exports.AiCampaignEngineModule = AiCampaignEngineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            ai_decision_module_1.AiDecisionModule,
            publish_jobs_module_1.PublishJobsModule,
            ai_action_log_module_1.AiActionLogModule,
        ],
        controllers: [
            ai_campaign_engine_controller_1.AiCampaignEngineController,
        ],
        providers: [
            ai_campaign_engine_service_1.AiCampaignEngineService,
        ],
        exports: [
            ai_campaign_engine_service_1.AiCampaignEngineService,
        ],
    })
], AiCampaignEngineModule);
//# sourceMappingURL=ai-campaign-engine.module.js.map