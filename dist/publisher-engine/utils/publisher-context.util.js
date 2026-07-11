"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherContextUtil = void 0;
class PublisherContextUtil {
    static create(job) {
        const result = job.result ?? {};
        return {
            jobId: job.id,
            vehicleId: result.entityId ?? null,
            campaignId: job.campaignId ?? null,
            channelId: job.channelId ?? null,
            channel: result.channel ?? "internal",
            title: job.title,
            content: job.content,
            result,
            attempt: Number(job.retryCount ?? 0) + 1,
            correlationId: job.correlationId ?? `pub_${job.id}`,
            metadata: result.metadata ?? {},
        };
    }
}
exports.PublisherContextUtil = PublisherContextUtil;
//# sourceMappingURL=publisher-context.util.js.map