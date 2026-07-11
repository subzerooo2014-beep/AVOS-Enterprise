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
exports.PublisherPreviewService = void 0;
const common_1 = require("@nestjs/common");
const publisher_context_builder_service_1 = require("./publisher-context-builder.service");
let PublisherPreviewService = class PublisherPreviewService {
    constructor(contextBuilder) {
        this.contextBuilder = contextBuilder;
    }
    preview(input) {
        const fakeJob = {
            id: input.id ?? "preview",
            title: input.title,
            content: input.content ?? null,
            campaignId: input.campaignId ?? null,
            channelId: input.channelId ?? null,
            retryCount: 0,
            result: input.result ?? {},
        };
        return {
            success: true,
            preview: {
                context: this.contextBuilder.build(fakeJob),
                title: input.title,
                content: input.content ?? "",
                channel: input.result?.channel ?? "internal",
                generatedAt: new Date(),
            },
        };
    }
};
exports.PublisherPreviewService = PublisherPreviewService;
exports.PublisherPreviewService = PublisherPreviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_context_builder_service_1.PublisherContextBuilderService])
], PublisherPreviewService);
//# sourceMappingURL=publisher-preview.service.js.map