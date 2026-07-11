"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PlatformExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let PlatformExceptionFilter = PlatformExceptionFilter_1 = class PlatformExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(PlatformExceptionFilter_1.name);
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const statusCode = this.statusCode(exception);
        const details = this.details(exception);
        const requestId = request.requestId ??
            "unknown";
        const durationMs = typeof request
            .requestStartedAt ===
            "number"
            ? Math.max(0, Date.now() -
                request.requestStartedAt)
            : null;
        const method = request.method ??
            "UNKNOWN";
        const path = request.originalUrl ??
            request.url ??
            "unknown";
        const logMessage = [
            `requestId=${requestId}`,
            `method=${method}`,
            `path=${path}`,
            `status=${statusCode}`,
            `message=${details.message}`,
        ].join(" ");
        if (statusCode >= 500) {
            this.logger.error(logMessage, exception instanceof Error
                ? exception.stack
                : undefined);
        }
        else {
            this.logger.warn(logMessage);
        }
        response
            .status(statusCode)
            .json({
            success: false,
            error: {
                code: details.code,
                message: details.message,
                details: details.details,
            },
            request: {
                requestId,
                method,
                path,
                durationMs,
            },
            timestamp: new Date()
                .toISOString(),
        });
    }
    statusCode(exception) {
        if (exception instanceof
            common_1.HttpException) {
            return exception.getStatus();
        }
        const error = exception;
        const prismaCode = String(error?.code ??
            "");
        switch (prismaCode) {
            case "P2002":
                return common_1.HttpStatus.CONFLICT;
            case "P2025":
                return common_1.HttpStatus.NOT_FOUND;
            case "P2003":
                return common_1.HttpStatus.BAD_REQUEST;
            case "P1001":
            case "P1002":
            case "P2024":
                return common_1.HttpStatus.SERVICE_UNAVAILABLE;
            default:
                return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    details(exception) {
        if (exception instanceof
            common_1.HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse ===
                "string") {
                return {
                    code: this.httpCode(exception.getStatus()),
                    message: exceptionResponse,
                    details: null,
                };
            }
            const body = exceptionResponse;
            const messages = Array.isArray(body?.message)
                ? body.message.map((item) => String(item))
                : null;
            return {
                code: String(body?.error ??
                    this.httpCode(exception.getStatus()))
                    .trim()
                    .toUpperCase()
                    .replace(/\s+/g, "_"),
                message: messages
                    ? messages.join("; ")
                    : String(body?.message ??
                        exception.message),
                details: messages
                    ? {
                        validationErrors: messages,
                    }
                    : body?.details ??
                        null,
            };
        }
        const error = exception;
        const prismaCode = String(error?.code ??
            "");
        if (prismaCode) {
            return {
                code: prismaCode,
                message: this.prismaMessage(prismaCode),
                details: this.isProduction()
                    ? null
                    : {
                        originalMessage: String(error?.message ??
                            ""),
                    },
            };
        }
        return {
            code: "INTERNAL_SERVER_ERROR",
            message: this.isProduction()
                ? "An internal server error occurred."
                : exception instanceof
                    Error
                    ? exception.message
                    : "Unknown internal error.",
            details: null,
        };
    }
    prismaMessage(code) {
        switch (code) {
            case "P2002":
                return "A record with the same unique value already exists.";
            case "P2025":
                return "The requested database record was not found.";
            case "P2003":
                return "The operation violates a database relationship.";
            case "P1001":
            case "P1002":
            case "P2024":
                return "The database is temporarily unavailable.";
            default:
                return "A database operation failed.";
        }
    }
    httpCode(status) {
        switch (status) {
            case 400:
                return "BAD_REQUEST";
            case 401:
                return "UNAUTHORIZED";
            case 403:
                return "FORBIDDEN";
            case 404:
                return "NOT_FOUND";
            case 409:
                return "CONFLICT";
            case 422:
                return "UNPROCESSABLE_ENTITY";
            case 429:
                return "TOO_MANY_REQUESTS";
            case 503:
                return "SERVICE_UNAVAILABLE";
            default:
                return status >= 500
                    ? "INTERNAL_SERVER_ERROR"
                    : "HTTP_ERROR";
        }
    }
    isProduction() {
        return String(process.env.NODE_ENV ??
            "development").toLowerCase() ===
            "production";
    }
};
exports.PlatformExceptionFilter = PlatformExceptionFilter;
exports.PlatformExceptionFilter = PlatformExceptionFilter = PlatformExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], PlatformExceptionFilter);
//# sourceMappingURL=platform-exception.filter.js.map