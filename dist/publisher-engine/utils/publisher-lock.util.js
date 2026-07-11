"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherLockUtil = void 0;
class PublisherLockUtil {
    static expired(lockedAt, timeoutMinutes = 10) {
        if (!lockedAt)
            return true;
        const value = new Date(lockedAt).getTime();
        return Date.now() - value > timeoutMinutes * 60 * 1000;
    }
    static token(jobId) {
        return `pub_lock_${jobId}_${Date.now()}`;
    }
}
exports.PublisherLockUtil = PublisherLockUtil;
//# sourceMappingURL=publisher-lock.util.js.map