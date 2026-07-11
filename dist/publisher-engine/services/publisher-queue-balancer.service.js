"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherQueueBalancerService = void 0;
const common_1 = require("@nestjs/common");
let PublisherQueueBalancerService = class PublisherQueueBalancerService {
    balance(jobs) {
        return [...jobs].sort((a, b) => {
            const pa = String(a.priority ?? "normal");
            const pb = String(b.priority ?? "normal");
            if (pa === pb) {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            const weight = {
                urgent: 1,
                high: 2,
                normal: 3,
                low: 4,
            };
            return (weight[pa] ?? 3) - (weight[pb] ?? 3);
        });
    }
};
exports.PublisherQueueBalancerService = PublisherQueueBalancerService;
exports.PublisherQueueBalancerService = PublisherQueueBalancerService = __decorate([
    (0, common_1.Injectable)()
], PublisherQueueBalancerService);
//# sourceMappingURL=publisher-queue-balancer.service.js.map