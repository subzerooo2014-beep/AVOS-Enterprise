"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobRetryPolicyService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobRetryPolicyService = class PublisherJobRetryPolicyService {
    canRetry(job) {
        return Number(job.retryCount ?? 0) < Number(job.maxRetries ?? 3);
    }
    nextStatus(job) {
        return this.canRetry(job) ? "queued" : "dead";
    }
};
exports.PublisherJobRetryPolicyService = PublisherJobRetryPolicyService;
exports.PublisherJobRetryPolicyService = PublisherJobRetryPolicyService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobRetryPolicyService);
//# sourceMappingURL=publisher-job-retry-policy.service.js.map