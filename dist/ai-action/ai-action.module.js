"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiActionModule = void 0;
const common_1 = require("@nestjs/common");
const ai_decision_module_1 = require("../ai-decision/ai-decision.module");
const ai_action_log_module_1 = require("../ai-action-log/ai-action-log.module");
const publish_jobs_module_1 = require("../publish-jobs/publish-jobs.module");
const ai_action_controller_1 = require("./ai-action.controller");
const ai_action_service_1 = require("./ai-action.service");
let AiActionModule = class AiActionModule {
};
exports.AiActionModule = AiActionModule;
exports.AiActionModule = AiActionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ai_decision_module_1.AiDecisionModule,
            ai_action_log_module_1.AiActionLogModule,
            publish_jobs_module_1.PublishJobsModule,
        ],
        controllers: [
            ai_action_controller_1.AiActionController,
        ],
        providers: [
            ai_action_service_1.AiActionService,
        ],
    })
], AiActionModule);
//# sourceMappingURL=ai-action.module.js.map