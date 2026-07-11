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
exports.PublisherEngineFinalizerService = void 0;
const common_1 = require("@nestjs/common");
const publisher_engine_profiler_service_1 = require("./publisher-engine-profiler.service");
const publisher_engine_summary_service_1 = require("./publisher-engine-summary.service");
let PublisherEngineFinalizerService = class PublisherEngineFinalizerService {
    constructor(profiler, summary) {
        this.profiler = profiler;
        this.summary = summary;
    }
    async finalize() {
        return {
            success: true,
            summary: await this.summary.summary(),
            profiler: this.profiler.profile(),
            completedAt: new Date(),
        };
    }
};
exports.PublisherEngineFinalizerService = PublisherEngineFinalizerService;
exports.PublisherEngineFinalizerService = PublisherEngineFinalizerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_engine_profiler_service_1.PublisherEngineProfilerService,
        publisher_engine_summary_service_1.PublisherEngineSummaryService])
], PublisherEngineFinalizerService);
//# sourceMappingURL=publisher-engine-finalizer.service.js.map