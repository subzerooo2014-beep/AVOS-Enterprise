"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPublishingPipelineModule = void 0;
const common_1 = require("@nestjs/common");
const ai_decision_module_1 = require("../ai-decision/ai-decision.module");
const publish_jobs_module_1 = require("../publish-jobs/publish-jobs.module");
const ai_action_log_module_1 = require("../ai-action-log/ai-action-log.module");
const ai_publishing_pipeline_controller_1 = require("./ai-publishing-pipeline.controller");
const ai_publishing_pipeline_service_1 = require("./ai-publishing-pipeline.service");
let AiPublishingPipelineModule = class AiPublishingPipelineModule {
};
exports.AiPublishingPipelineModule = AiPublishingPipelineModule;
exports.AiPublishingPipelineModule = AiPublishingPipelineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ai_decision_module_1.AiDecisionModule,
            publish_jobs_module_1.PublishJobsModule,
            ai_action_log_module_1.AiActionLogModule,
        ],
        controllers: [
            ai_publishing_pipeline_controller_1.AiPublishingPipelineController,
        ],
        providers: [
            ai_publishing_pipeline_service_1.AiPublishingPipelineService,
        ],
        exports: [
            ai_publishing_pipeline_service_1.AiPublishingPipelineService,
        ],
    })
], AiPublishingPipelineModule);
//# sourceMappingURL=ai-publishing-pipeline.module.js.map