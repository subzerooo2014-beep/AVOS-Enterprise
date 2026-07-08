"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRetryPolicyService = void 0;
const common_1 = require("@nestjs/common");
let AiRetryPolicyService = class AiRetryPolicyService {
    async run(fn, attempts = 3) {
        let lastError;
        for (let i = 0; i < attempts; i++) {
            try {
                return await fn();
            }
            catch (err) {
                lastError = err;
            }
        }
        throw lastError;
    }
};
exports.AiRetryPolicyService = AiRetryPolicyService;
exports.AiRetryPolicyService = AiRetryPolicyService = __decorate([
    (0, common_1.Injectable)()
], AiRetryPolicyService);
//# sourceMappingURL=ai-retry-policy.service.js.map