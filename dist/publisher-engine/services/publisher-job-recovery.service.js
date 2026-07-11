"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobRecoveryService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobRecoveryService = class PublisherJobRecoveryService {
    recover(job) {
        return {
            ...job,
            status: "queued",
            retryCount: Number(job.retryCount ?? 0) + 1,
            lockedAt: null,
            lockToken: null,
            workerId: null,
            lastError: null,
            updatedAt: new Date(),
        };
    }
};
exports.PublisherJobRecoveryService = PublisherJobRecoveryService;
exports.PublisherJobRecoveryService = PublisherJobRecoveryService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobRecoveryService);
//# sourceMappingURL=publisher-job-recovery.service.js.map