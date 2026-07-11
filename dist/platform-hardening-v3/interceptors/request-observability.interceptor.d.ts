import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { RequestMetricsService } from "../services/request-metrics.service";
import { RequestContextService } from "../services/request-context.service";
import { StructuredLoggerService } from "../services/structured-logger.service";
export declare class RequestObservabilityInterceptor implements NestInterceptor {
    private readonly context;
    private readonly metrics;
    private readonly logger;
    private readonly slowRequestThresholdMs;
    constructor(context: RequestContextService, metrics: RequestMetricsService, logger: StructuredLoggerService);
    intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown>;
    private complete;
    private readSlowRequestThreshold;
}
