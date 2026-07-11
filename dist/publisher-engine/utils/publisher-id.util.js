"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLockToken = makeLockToken;
exports.makeCorrelationId = makeCorrelationId;
function makeLockToken(jobId) {
    return `lock_${jobId}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function makeCorrelationId(jobId) {
    return `pub_${jobId}_${Date.now()}`;
}
//# sourceMappingURL=publisher-id.util.js.map