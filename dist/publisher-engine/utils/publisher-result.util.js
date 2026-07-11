"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherResultUtil = void 0;
class PublisherResultUtil {
    static published(channel, externalId, metadata) {
        return {
            status: "published",
            channel,
            externalId,
            message: "Publisher completed successfully.",
            metadata: metadata ?? {},
        };
    }
    static failed(channel, message, metadata) {
        return {
            status: "failed",
            channel,
            message,
            metadata: metadata ?? {},
        };
    }
    static skipped(channel, reason) {
        return {
            status: "skipped",
            channel,
            message: reason,
            metadata: {},
        };
    }
}
exports.PublisherResultUtil = PublisherResultUtil;
//# sourceMappingURL=publisher-result.util.js.map