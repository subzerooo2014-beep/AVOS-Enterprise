"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRateLimitService = void 0;
const common_1 = require("@nestjs/common");
let PublisherRateLimitService = class PublisherRateLimitService {
    constructor() {
        this.requests = new Map();
    }
    allow(channel, limit = 100) {
        const current = this.requests.get(channel) ?? 0;
        if (current >= limit) {
            return false;
        }
        this.requests.set(channel, current + 1);
        return true;
    }
    reset(channel) {
        if (channel) {
            this.requests.delete(channel);
            return;
        }
        this.requests.clear();
    }
    usage() {
        return Object.fromEntries(this.requests.entries());
    }
};
exports.PublisherRateLimitService = PublisherRateLimitService;
exports.PublisherRateLimitService = PublisherRateLimitService = __decorate([
    (0, common_1.Injectable)()
], PublisherRateLimitService);
//# sourceMappingURL=publisher-rate-limit.service.js.map