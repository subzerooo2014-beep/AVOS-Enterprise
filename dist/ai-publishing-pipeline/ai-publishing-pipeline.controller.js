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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPublishingPipelineController = void 0;
const common_1 = require("@nestjs/common");
const ai_publishing_pipeline_service_1 = require("./ai-publishing-pipeline.service");
let AiPublishingPipelineController = class AiPublishingPipelineController {
    constructor(service) {
        this.service = service;
    }
    async run(id) {
        try {
            return await this.service.run(id);
        }
        catch (e) {
            return {
                failed: true,
                message: e?.message,
                stack: e?.stack,
                code: e?.code,
                meta: e?.meta,
            };
        }
    }
    async preview(id) {
        return this.run(id);
    }
};
exports.AiPublishingPipelineController = AiPublishingPipelineController;
__decorate([
    (0, common_1.Post)("vehicle/:id/run"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiPublishingPipelineController.prototype, "run", null);
__decorate([
    (0, common_1.Get)("vehicle/:id/preview"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiPublishingPipelineController.prototype, "preview", null);
exports.AiPublishingPipelineController = AiPublishingPipelineController = __decorate([
    (0, common_1.Controller)("ai-publishing-pipeline"),
    __metadata("design:paramtypes", [ai_publishing_pipeline_service_1.AiPublishingPipelineService])
], AiPublishingPipelineController);
//# sourceMappingURL=ai-publishing-pipeline.controller.js.map