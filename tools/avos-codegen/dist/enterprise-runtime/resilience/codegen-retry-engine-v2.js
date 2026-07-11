"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRetryEngineV2 = void 0;
class CodeGenRetryEngineV2 {
    normalize(input = {}) {
        return {
            maximumAttempts: Math.max(1, input.maximumAttempts ??
                3),
            initialDelayMs: Math.max(0, input.initialDelayMs ??
                100),
            maximumDelayMs: Math.max(0, input.maximumDelayMs ??
                5000),
            multiplier: Math.max(1, input.multiplier ??
                2),
            retryableErrorPatterns: [...(input.retryableErrorPatterns ??
                    [])],
        };
    }
    async execute(operation, policyInput = {}) {
        const policy = this.normalize(policyInput);
        const attempts = [];
        let lastError;
        for (let attempt = 1; attempt <=
            policy.maximumAttempts; attempt += 1) {
            const startedAt = new Date().toISOString();
            try {
                const value = await operation(attempt);
                return {
                    success: true,
                    value,
                    attempts,
                    completedAt: new Date().toISOString(),
                };
            }
            catch (error) {
                const completedAt = new Date().toISOString();
                lastError =
                    error instanceof Error
                        ? error.message
                        : String(error);
                const delayMs = this.delayForAttempt(policy, attempt);
                attempts.push({
                    attempt,
                    delayMs,
                    error: lastError,
                    startedAt,
                    completedAt,
                });
                if (attempt >=
                    policy.maximumAttempts ||
                    !this.shouldRetry(lastError, policy)) {
                    break;
                }
                if (delayMs > 0) {
                    await new Promise((resolve) => {
                        setTimeout(resolve, delayMs);
                    });
                }
            }
        }
        return {
            success: false,
            attempts,
            ...(lastError
                ? {
                    error: lastError,
                }
                : {}),
            completedAt: new Date().toISOString(),
        };
    }
    delayForAttempt(policy, attempt) {
        if (attempt <= 0) {
            return 0;
        }
        return Math.min(policy.maximumDelayMs, Math.round(policy.initialDelayMs *
            Math.pow(policy.multiplier, Math.max(0, attempt - 1))));
    }
    shouldRetry(errorMessage, policy) {
        if (policy
            .retryableErrorPatterns
            .length === 0) {
            return true;
        }
        return policy
            .retryableErrorPatterns
            .some((pattern) => errorMessage.includes(pattern));
    }
}
exports.CodeGenRetryEngineV2 = CodeGenRetryEngineV2;
//# sourceMappingURL=codegen-retry-engine-v2.js.map