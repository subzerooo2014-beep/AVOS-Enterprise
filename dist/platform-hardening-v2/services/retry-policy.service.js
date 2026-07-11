"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RetryPolicyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryPolicyService = void 0;
const common_1 = require("@nestjs/common");
let RetryPolicyService = RetryPolicyService_1 = class RetryPolicyService {
    constructor() {
        this.logger = new common_1.Logger(RetryPolicyService_1.name);
    }
    async execute(operationName, operation, options = {}) {
        const attempts = this.normalizeInteger(options.attempts, 3, 1, 10);
        const initialDelayMs = this.normalizeInteger(options.initialDelayMs, 100, 0, 60_000);
        const maximumDelayMs = this.normalizeInteger(options.maximumDelayMs, 5_000, 0, 300_000);
        const backoffMultiplier = typeof options.backoffMultiplier === "number" &&
            options.backoffMultiplier >= 1
            ? options.backoffMultiplier
            : 2;
        let lastError;
        for (let attempt = 1; attempt <= attempts; attempt += 1) {
            try {
                return await operation(attempt);
            }
            catch (error) {
                lastError = error;
                const canRetry = attempt < attempts &&
                    (options.shouldRetry
                        ? options.shouldRetry(error, attempt)
                        : true);
                if (!canRetry) {
                    throw error;
                }
                const calculatedDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
                const delayMs = Math.min(calculatedDelay, maximumDelayMs);
                this.logger.warn(`${operationName} failed on attempt ${attempt}/${attempts}. ` +
                    `Retrying in ${delayMs}ms.`);
                await this.delay(delayMs);
            }
        }
        throw lastError instanceof Error
            ? lastError
            : new Error(`${operationName} failed after ${attempts} attempts`);
    }
    delay(milliseconds) {
        if (milliseconds <= 0) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const timer = setTimeout(resolve, milliseconds);
            timer.unref?.();
        });
    }
    normalizeInteger(value, fallback, minimum, maximum) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        return Math.min(maximum, Math.max(minimum, Math.floor(value)));
    }
};
exports.RetryPolicyService = RetryPolicyService;
exports.RetryPolicyService = RetryPolicyService = RetryPolicyService_1 = __decorate([
    (0, common_1.Injectable)()
], RetryPolicyService);
//# sourceMappingURL=retry-policy.service.js.map