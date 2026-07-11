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
exports.PublisherProductionService = void 0;
const common_1 = require("@nestjs/common");
const publisher_production_report_service_1 = require("./publisher-production-report.service");
const publisher_job_executor_service_1 = require("./publisher-job-executor.service");
let PublisherProductionService = class PublisherProductionService {
    constructor(report, executor) {
        this.report = report;
        this.executor = executor;
    }
    async execute(limit = 20) {
        return {
            success: true,
            execution: await this.executor.execute(limit),
            report: await this.report.report(),
            finishedAt: new Date(),
        };
    }
};
exports.PublisherProductionService = PublisherProductionService;
exports.PublisherProductionService = PublisherProductionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_production_report_service_1.PublisherProductionReportService,
        publisher_job_executor_service_1.PublisherJobExecutorService])
], PublisherProductionService);
//# sourceMappingURL=publisher-production.service.js.map