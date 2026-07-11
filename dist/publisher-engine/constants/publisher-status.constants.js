"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUBLISHER_WORKER_ID = exports.PUBLISH_PRIORITY = exports.PUBLISH_JOB_STATUS = void 0;
exports.PUBLISH_JOB_STATUS = {
    QUEUED: "queued",
    LOCKED: "locked",
    PROCESSING: "processing",
    PUBLISHED: "published",
    FAILED: "failed",
    RETRYING: "retrying",
    SKIPPED: "skipped",
    DEAD: "dead",
};
exports.PUBLISH_PRIORITY = {
    LOW: "low",
    NORMAL: "normal",
    HIGH: "high",
    URGENT: "urgent",
};
exports.PUBLISHER_WORKER_ID = "avos-publisher-engine-v2";
//# sourceMappingURL=publisher-status.constants.js.map