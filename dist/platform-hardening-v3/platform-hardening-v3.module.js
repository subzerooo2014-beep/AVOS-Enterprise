"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV3Module = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_hardening_v3_controller_1 = require("./controllers/platform-hardening-v3.controller");
const global_observability_exception_filter_1 = require("./filters/global-observability-exception.filter");
const diagnostics_token_guard_1 = require("./guards/diagnostics-token.guard");
const request_observability_interceptor_1 = require("./interceptors/request-observability.interceptor");
const request_correlation_middleware_1 = require("./middleware/request-correlation.middleware");
const alert_rule_service_1 = require("./services/alert-rule.service");
const error_classification_service_1 = require("./services/error-classification.service");
const failure_fingerprint_service_1 = require("./services/failure-fingerprint.service");
const incident_registry_service_1 = require("./services/incident-registry.service");
const platform_hardening_v3_service_1 = require("./services/platform-hardening-v3.service");
const request_context_service_1 = require("./services/request-context.service");
const request_metrics_service_1 = require("./services/request-metrics.service");
const structured_logger_service_1 = require("./services/structured-logger.service");
let PlatformHardeningV3Module = class PlatformHardeningV3Module {
    configure(consumer) {
        consumer
            .apply(request_correlation_middleware_1.RequestCorrelationMiddleware)
            .forRoutes("*");
    }
};
exports.PlatformHardeningV3Module = PlatformHardeningV3Module;
exports.PlatformHardeningV3Module = PlatformHardeningV3Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            platform_hardening_v3_controller_1.PlatformHardeningV3Controller,
        ],
        providers: [
            alert_rule_service_1.AlertRuleService,
            diagnostics_token_guard_1.DiagnosticsTokenGuard,
            error_classification_service_1.ErrorClassificationService,
            failure_fingerprint_service_1.FailureFingerprintService,
            incident_registry_service_1.IncidentRegistryService,
            platform_hardening_v3_service_1.PlatformHardeningV3Service,
            request_context_service_1.RequestContextService,
            request_metrics_service_1.RequestMetricsService,
            structured_logger_service_1.StructuredLoggerService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: request_observability_interceptor_1.RequestObservabilityInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: global_observability_exception_filter_1.GlobalObservabilityExceptionFilter,
            },
        ],
        exports: [
            alert_rule_service_1.AlertRuleService,
            error_classification_service_1.ErrorClassificationService,
            failure_fingerprint_service_1.FailureFingerprintService,
            incident_registry_service_1.IncidentRegistryService,
            platform_hardening_v3_service_1.PlatformHardeningV3Service,
            request_context_service_1.RequestContextService,
            request_metrics_service_1.RequestMetricsService,
            structured_logger_service_1.StructuredLoggerService,
        ],
    })
], PlatformHardeningV3Module);
//# sourceMappingURL=platform-hardening-v3.module.js.map