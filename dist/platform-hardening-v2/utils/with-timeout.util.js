"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationTimeoutError = void 0;
exports.withTimeout = withTimeout;
class OperationTimeoutError extends Error {
    constructor(timeoutMs, operationName = "operation") {
        super(`${operationName} exceeded timeout of ${timeoutMs}ms`);
        this.timeoutMs = timeoutMs;
        this.operationName = operationName;
        this.name = "OperationTimeoutError";
    }
}
exports.OperationTimeoutError = OperationTimeoutError;
async function withTimeout(operation, timeoutMs, operationName = "operation") {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        return operation;
    }
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new OperationTimeoutError(timeoutMs, operationName));
        }, timeoutMs);
        timer.unref?.();
    });
    try {
        return await Promise.race([operation, timeoutPromise]);
    }
    finally {
        if (timer) {
            clearTimeout(timer);
        }
    }
}
//# sourceMappingURL=with-timeout.util.js.map