"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCampaignManagerModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_campaign_manager_service_1 = require("./ai-campaign-manager.service");
const ai_campaign_launch_service_1 = require("./ai-campaign-launch.service");
const ai_campaign_launch_controller_1 = require("./ai-campaign-launch.controller");
const ai_campaign_manager_controller_1 = require("./ai-campaign-manager.controller");
let AiCampaignManagerModule = class AiCampaignManagerModule {
};
exports.AiCampaignManagerModule = AiCampaignManagerModule;
exports.AiCampaignManagerModule = AiCampaignManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
        ],
        controllers: [
            ai_campaign_manager_controller_1.AiCampaignManagerController,
            ai_campaign_launch_controller_1.AiCampaignLaunchController,
        ],
        providers: [
            ai_campaign_manager_service_1.AiCampaignManagerService,
            ai_campaign_launch_service_1.AiCampaignLaunchService,
        ],
        exports: [
            ai_campaign_manager_service_1.AiCampaignManagerService,
            ai_campaign_launch_service_1.AiCampaignLaunchService,
        ],
    })
], AiCampaignManagerModule);
//# sourceMappingURL=ai-campaign-manager.module.js.map