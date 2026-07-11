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
exports.PublisherJobSummaryService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_filter_service_1 = require("./publisher-job-filter.service");
const publisher_job_group_service_1 = require("./publisher-job-group.service");
let PublisherJobSummaryService = class PublisherJobSummaryService {
    constructor(filter, group) {
        this.filter = filter;
        this.group = group;
    }
    summary(jobs) {
        return {
            total: jobs.length,
            queued: this.filter.queued(jobs).length,
            processing: this.filter.processing(jobs).length,
            published: this.filter.published(jobs).length,
            failed: this.filter.failed(jobs).length,
            channels: this.group.byChannel(jobs),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherJobSummaryService = PublisherJobSummaryService;
exports.PublisherJobSummaryService = PublisherJobSummaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_filter_service_1.PublisherJobFilterService,
        publisher_job_group_service_1.PublisherJobGroupService])
], PublisherJobSummaryService);
//# sourceMappingURL=publisher-job-summary.service.js.map