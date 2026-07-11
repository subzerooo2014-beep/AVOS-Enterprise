"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestObservabilityInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const request_metrics_service_1 = require("../services/request-metrics.service");
const request_context_service_1 = require("../services/request-context.service");
const structured_logger_service_1 = require("../services/structured-logger.service");
let RequestObservabilityInterceptor = class RequestObservabilityInterceptor {
    constructor(context, metrics, logger) {
        this.context = context;
        this.metrics = metrics;
        this.logger = logger;
        this.slowRequestThresholdMs = this.readSlowRequestThreshold();
    }
    intercept(executionContext, next) {
        const request = executionContext.switchToHttp().getRequest();
        const response = executionContext.switchToHttp().getResponse();
        const requestContext = this.context.get();
        const startedAt = requestContext?.startedAt ?? Date.now();
        this.logger.info("http.request.started", `${request.method} ${request.originalUrl ?? request.url}`, {
            ip: request.ip,
            userAgent: request.headers?.["user-agent"],
        });
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                this.complete(request, response, startedAt, true);
            },
        }));
    }
    complete(request, response, startedAt, success) {
        const context = this.context.get();
        const durationMs = Number((Date.now() - startedAt).toFixed(3));
        const statusCode = Number(response.statusCode) || 200;
        const slow = durationMs >= this.slowRequestThresholdMs;
        this.metrics.record({
            correlationId: context?.correlationId ?? "unknown",
            traceId: context?.traceId ?? "unknown",
            method: request.method,
            path: request.originalUrl ??
                request.url ??
                "unknown",
            statusCode,
            durationMs,
            success: success &&
                statusCode >= 200 &&
                statusCode < 400,
            slow,
            timestamp: new Date().toISOString(),
        });
        const metadata = {
            statusCode,
            durationMs,
            slow,
            slowRequestThresholdMs: this.slowRequestThresholdMs,
        };
        if (slow) {
            this.logger.warn("http.request.slow", `${request.method} ${request.originalUrl ?? request.url} completed slowly`, metadata);
            return;
        }
        this.logger.info("http.request.completed", `${request.method} ${request.originalUrl ?? request.url} completed`, metadata);
    }
    readSlowRequestThreshold() {
        const configured = Number(process.env.AVOS_SLOW_REQUEST_THRESHOLD_MS);
        if (Number.isFinite(configured) &&
            configured >= 1) {
            return configured;
        }
        return 750;
    }
};
exports.RequestObservabilityInterceptor = RequestObservabilityInterceptor;
exports.RequestObservabilityInterceptor = RequestObservabilityInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        request_metrics_service_1.RequestMetricsService,
        structured_logger_service_1.StructuredLoggerService])
], RequestObservabilityInterceptor);
//# sourceMappingURL=request-observability.interceptor.js.map