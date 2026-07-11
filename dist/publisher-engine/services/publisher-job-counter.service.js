"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobCounterService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobCounterService = class PublisherJobCounterService {
    count(jobs) {
        return {
            total: jobs.length,
            queued: jobs.filter(j => j.status === "queued").length,
            processing: jobs.filter(j => j.status === "processing").length,
            published: jobs.filter(j => j.status === "published").length,
            failed: jobs.filter(j => j.status === "failed").length,
            dead: jobs.filter(j => j.status === "dead").length,
            skipped: jobs.filter(j => j.status === "skipped").length,
        };
    }
};
exports.PublisherJobCounterService = PublisherJobCounterService;
exports.PublisherJobCounterService = PublisherJobCounterService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobCounterService);
//# sourceMappingURL=publisher-job-counter.service.js.map