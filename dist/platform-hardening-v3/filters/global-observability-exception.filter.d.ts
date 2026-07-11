import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { RequestMetricsService } from "../services/request-metrics.service";
import { ErrorClassificationService } from "../services/error-classification.service";
import { FailureFingerprintService } from "../services/failure-fingerprint.service";
import { IncidentRegistryService } from "../services/incident-registry.service";
import { RequestContextService } from "../services/request-context.service";
import { StructuredLoggerService } from "../services/structured-logger.service";
export declare class GlobalObservabilityExceptionFilter implements ExceptionFilter {
    private readonly context;
    private readonly classificationService;
    private readonly fingerprints;
    private readonly incidents;
    private readonly metrics;
    private readonly logger;
    constructor(context: RequestContextService, classificationService: ErrorClassificationService, fingerprints: FailureFingerprintService, incidents: IncidentRegistryService, metrics: RequestMetricsService, logger: StructuredLoggerService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private extractMessage;
}
