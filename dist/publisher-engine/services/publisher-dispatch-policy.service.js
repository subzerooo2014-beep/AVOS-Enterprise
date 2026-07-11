"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherDispatchPolicyService = void 0;
const common_1 = require("@nestjs/common");
let PublisherDispatchPolicyService = class PublisherDispatchPolicyService {
    allow(job) {
        if (job.status !== "queued") {
            return false;
        }
        if (job.scheduledAt && new Date(job.scheduledAt) > new Date()) {
            return false;
        }
        return true;
    }
};
exports.PublisherDispatchPolicyService = PublisherDispatchPolicyService;
exports.PublisherDispatchPolicyService = PublisherDispatchPolicyService = __decorate([
    (0, common_1.Injectable)()
], PublisherDispatchPolicyService);
//# sourceMappingURL=publisher-dispatch-policy.service.js.map