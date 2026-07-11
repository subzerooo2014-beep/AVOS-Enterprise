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
exports.PublisherAutoRecoveryService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_recovery_service_1 = require("./publisher-job-recovery.service");
const publisher_job_retry_policy_service_1 = require("./publisher-job-retry-policy.service");
let PublisherAutoRecoveryService = class PublisherAutoRecoveryService {
    constructor(recovery, retry) {
        this.recovery = recovery;
        this.retry = retry;
    }
    recover(job) {
        if (!this.retry.canRetry(job)) {
            return {
                ...job,
                status: "dead",
            };
        }
        return this.recovery.recover(job);
    }
};
exports.PublisherAutoRecoveryService = PublisherAutoRecoveryService;
exports.PublisherAutoRecoveryService = PublisherAutoRecoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_recovery_service_1.PublisherJobRecoveryService,
        publisher_job_retry_policy_service_1.PublisherJobRetryPolicyService])
], PublisherAutoRecoveryService);
//# sourceMappingURL=publisher-auto-recovery.service.js.map