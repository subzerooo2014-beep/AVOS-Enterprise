"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRetryPolicy = void 0;
class PublisherRetryPolicy {
    static shouldRetry(job) {
        const retryCount = Number(job.retryCount ?? 0);
        const maxRetries = Number(job.maxRetries ?? 3);
        return retryCount < maxRetries;
    }
    static nextStatus(job) {
        return this.shouldRetry(job) ? "queued" : "dead";
    }
}
exports.PublisherRetryPolicy = PublisherRetryPolicy;
//# sourceMappingURL=publisher-retry.policy.js.map