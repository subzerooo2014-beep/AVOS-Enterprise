"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorRateLimiterService = void 0;
const common_1 = require("@nestjs/common");
let ConnectorRateLimiterService = class ConnectorRateLimiterService {
    constructor() {
        this.buckets = new Map();
        this.windowMs = this.positiveInteger(process.env.CONNECTOR_RATE_LIMIT_WINDOW_MS, 60_000);
        this.limit = this.positiveInteger(process.env.CONNECTOR_RATE_LIMIT_MAX, 60);
    }
    consume(channel, identity = "global") {
        const now = Date.now();
        const key = `${channel}:${identity}`;
        let bucket = this.buckets.get(key);
        if (!bucket ||
            bucket.resetAt <= now) {
            bucket = {
                count: 0,
                resetAt: now + this.windowMs,
            };
            this.buckets.set(key, bucket);
        }
        if (bucket.count >=
            this.limit) {
            return {
                allowed: false,
                channel,
                identity,
                limit: this.limit,
                remaining: 0,
                resetAt: new Date(bucket.resetAt),
            };
        }
        bucket.count += 1;
        return {
            allowed: true,
            channel,
            identity,
            limit: this.limit,
            remaining: Math.max(0, this.limit -
                bucket.count),
            resetAt: new Date(bucket.resetAt),
        };
    }
    status() {
        const now = Date.now();
        const activeBuckets = Array.from(this.buckets.values()).filter((bucket) => bucket.resetAt > now).length;
        return {
            windowMs: this.windowMs,
            limit: this.limit,
            activeBuckets,
        };
    }
    positiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
};
exports.ConnectorRateLimiterService = ConnectorRateLimiterService;
exports.ConnectorRateLimiterService = ConnectorRateLimiterService = __decorate([
    (0, common_1.Injectable)()
], ConnectorRateLimiterService);
//# sourceMappingURL=connector-rate-limiter.service.js.map