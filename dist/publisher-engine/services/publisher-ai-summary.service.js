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
exports.PublisherAiSummaryService = void 0;
const common_1 = require("@nestjs/common");
const publisher_ai_score_service_1 = require("./publisher-ai-score.service");
const publisher_ai_routing_service_1 = require("./publisher-ai-routing.service");
let PublisherAiSummaryService = class PublisherAiSummaryService {
    constructor(score, routing) {
        this.score = score;
        this.routing = routing;
    }
    analyze(job) {
        return {
            success: true,
            score: this.score.score(job),
            routing: this.routing.route(job),
            analyzedAt: new Date(),
        };
    }
};
exports.PublisherAiSummaryService = PublisherAiSummaryService;
exports.PublisherAiSummaryService = PublisherAiSummaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_ai_score_service_1.PublisherAiScoreService,
        publisher_ai_routing_service_1.PublisherAiRoutingService])
], PublisherAiSummaryService);
//# sourceMappingURL=publisher-ai-summary.service.js.map