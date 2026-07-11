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
exports.RequestCorrelationMiddleware = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const request_context_service_1 = require("../services/request-context.service");
let RequestCorrelationMiddleware = class RequestCorrelationMiddleware {
    constructor(requestContext) {
        this.requestContext = requestContext;
    }
    use(request, response, next) {
        const incomingCorrelationId = this.readHeader(request.headers["x-correlation-id"]);
        const incomingTraceId = this.readHeader(request.headers["x-trace-id"]);
        const correlationId = incomingCorrelationId ?? (0, node_crypto_1.randomUUID)();
        const traceId = incomingTraceId ?? correlationId;
        const requestId = (0, node_crypto_1.randomUUID)();
        response.setHeader("x-correlation-id", correlationId);
        response.setHeader("x-trace-id", traceId);
        response.setHeader("x-request-id", requestId);
        const context = {
            correlationId,
            traceId,
            requestId,
            method: request.method,
            path: request.originalUrl ??
                request.url ??
                "/",
            ip: request.ip,
            userAgent: this.readHeader(request.headers["user-agent"]),
            startedAt: Date.now(),
        };
        this.requestContext.run(context, () => next());
    }
    readHeader(value) {
        if (Array.isArray(value)) {
            return value[0]?.trim() || undefined;
        }
        return value?.trim() || undefined;
    }
};
exports.RequestCorrelationMiddleware = RequestCorrelationMiddleware;
exports.RequestCorrelationMiddleware = RequestCorrelationMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], RequestCorrelationMiddleware);
//# sourceMappingURL=request-correlation.middleware.js.map