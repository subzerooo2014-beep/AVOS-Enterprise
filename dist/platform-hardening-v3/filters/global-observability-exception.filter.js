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
exports.GlobalObservabilityExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const request_metrics_service_1 = require("../services/request-metrics.service");
const error_classification_service_1 = require("../services/error-classification.service");
const failure_fingerprint_service_1 = require("../services/failure-fingerprint.service");
const incident_registry_service_1 = require("../services/incident-registry.service");
const request_context_service_1 = require("../services/request-context.service");
const structured_logger_service_1 = require("../services/structured-logger.service");
let GlobalObservabilityExceptionFilter = class GlobalObservabilityExceptionFilter {
    constructor(context, classificationService, fingerprints, incidents, metrics, logger) {
        this.context = context;
        this.classificationService = classificationService;
        this.fingerprints = fingerprints;
        this.incidents = incidents;
        this.metrics = metrics;
        this.logger = logger;
    }
    catch(exception, host) {
        const http = host.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        const context = this.context.get();
        const classification = this.classificationService.classify(exception);
        const message = this.extractMessage(exception);
        const fingerprint = this.fingerprints.create({
            error: exception,
            classification,
            method: request.method,
            path: request.originalUrl ??
                request.url,
        });
        const incident = this.incidents.register({
            fingerprint,
            title: `${classification.category} failure`,
            message,
            classification,
            correlationId: context?.correlationId,
            traceId: context?.traceId,
            method: request.method,
            path: request.originalUrl ??
                request.url,
            metadata: {
                retryable: classification.retryable,
                operational: classification.operational,
                errorName: exception instanceof Error
                    ? exception.name
                    : typeof exception,
            },
        });
        const durationMs = Number((Date.now() -
            (context?.startedAt ?? Date.now())).toFixed(3));
        this.metrics.record({
            correlationId: context?.correlationId ?? "unknown",
            traceId: context?.traceId ?? "unknown",
            method: request.method,
            path: request.originalUrl ??
                request.url ??
                "unknown",
            statusCode: classification.statusCode,
            durationMs,
            success: false,
            slow: durationMs >=
                Number(process.env
                    .AVOS_SLOW_REQUEST_THRESHOLD_MS ??
                    750),
            timestamp: new Date().toISOString(),
        });
        this.logger.error("http.request.failed", message, {
            fingerprint,
            incidentId: incident.id,
            category: classification.category,
            severity: classification.severity,
            statusCode: classification.statusCode,
            retryable: classification.retryable,
            durationMs,
        });
        response
            .status(classification.statusCode)
            .json({
            success: false,
            statusCode: classification.statusCode,
            error: classification.category,
            message,
            correlationId: context?.correlationId,
            traceId: context?.traceId,
            incidentReference: incident.id,
            timestamp: new Date().toISOString(),
            path: request.originalUrl ??
                request.url,
        });
    }
    extractMessage(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === "string") {
                return response;
            }
            if (typeof response === "object" &&
                response !== null &&
                "message" in response) {
                const message = response.message;
                if (Array.isArray(message)) {
                    return message.join(", ");
                }
                if (message) {
                    return String(message);
                }
            }
        }
        if (exception instanceof Error) {
            return exception.message;
        }
        return "Unexpected platform failure";
    }
};
exports.GlobalObservabilityExceptionFilter = GlobalObservabilityExceptionFilter;
exports.GlobalObservabilityExceptionFilter = GlobalObservabilityExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        error_classification_service_1.ErrorClassificationService,
        failure_fingerprint_service_1.FailureFingerprintService,
        incident_registry_service_1.IncidentRegistryService,
        request_metrics_service_1.RequestMetricsService,
        structured_logger_service_1.StructuredLoggerService])
], GlobalObservabilityExceptionFilter);
//# sourceMappingURL=global-observability-exception.filter.js.map