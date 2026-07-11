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
exports.PublisherFailureService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_writer_service_1 = require("./publisher-job-writer.service");
const publisher_retry_policy_1 = require("../policies/publisher-retry.policy");
let PublisherFailureService = class PublisherFailureService {
    constructor(writer) {
        this.writer = writer;
    }
    async fail(job, error) {
        const retryCount = Number(job.retryCount ?? 0) + 1;
        const finalStatus = publisher_retry_policy_1.PublisherRetryPolicy.nextStatus({ ...job, retryCount });
        return this.writer.update(job.id, {
            status: finalStatus,
            retryCount,
            failedAt: finalStatus === "dead" ? new Date() : null,
            lastError: error?.message ?? "Publisher failed",
            result: {
                ...(job.result ?? {}),
                publisher: {
                    status: "failed",
                    message: error?.message ?? "Publisher failed",
                    retryCount,
                    finalStatus,
                },
            },
        });
    }
};
exports.PublisherFailureService = PublisherFailureService;
exports.PublisherFailureService = PublisherFailureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_writer_service_1.PublisherJobWriterService])
], PublisherFailureService);
//# sourceMappingURL=publisher-failure.service.js.map