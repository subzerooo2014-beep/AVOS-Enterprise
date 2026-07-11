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
exports.PublisherProductionReportService = void 0;
const common_1 = require("@nestjs/common");
const publisher_engine_finalizer_service_1 = require("./publisher-engine-finalizer.service");
const publisher_runtime_monitor_service_1 = require("./publisher-runtime-monitor.service");
let PublisherProductionReportService = class PublisherProductionReportService {
    constructor(finalizer, runtime) {
        this.finalizer = finalizer;
        this.runtime = runtime;
    }
    async report() {
        return {
            success: true,
            finalizer: await this.finalizer.finalize(),
            runtime: this.runtime.status(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherProductionReportService = PublisherProductionReportService;
exports.PublisherProductionReportService = PublisherProductionReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_engine_finalizer_service_1.PublisherEngineFinalizerService,
        publisher_runtime_monitor_service_1.PublisherRuntimeMonitorService])
], PublisherProductionReportService);
//# sourceMappingURL=publisher-production-report.service.js.map