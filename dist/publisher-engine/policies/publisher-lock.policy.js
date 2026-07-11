"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherLockPolicy = void 0;
class PublisherLockPolicy {
    static isExpired(job, ttlMinutes = 10) {
        if (!job.lockedAt)
            return true;
        const lockedAt = new Date(job.lockedAt).getTime();
        return Date.now() - lockedAt > ttlMinutes * 60 * 1000;
    }
}
exports.PublisherLockPolicy = PublisherLockPolicy;
//# sourceMappingURL=publisher-lock.policy.js.map