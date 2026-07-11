"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobAnalyticsService = class PublisherJobAnalyticsService {
    analyze(jobs) {
        const analytics = {
            total: jobs.length,
            published: 0,
            failed: 0,
            queued: 0,
            processing: 0,
            skipped: 0,
            dead: 0,
        };
        for (const job of jobs) {
            switch (job.status) {
                case "published":
                    analytics.published++;
                    break;
                case "failed":
                    analytics.failed++;
                    break;
                case "queued":
                    analytics.queued++;
                    break;
                case "processing":
                    analytics.processing++;
                    break;
                case "skipped":
                    analytics.skipped++;
                    break;
                case "dead":
                    analytics.dead++;
                    break;
            }
        }
        return analytics;
    }
};
exports.PublisherJobAnalyticsService = PublisherJobAnalyticsService;
exports.PublisherJobAnalyticsService = PublisherJobAnalyticsService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobAnalyticsService);
//# sourceMappingURL=publisher-job-analytics.service.js.map