import { RequestContextService } from "./request-context.service";
export declare class StructuredLoggerService {
    private readonly requestContext;
    constructor(requestContext: RequestContextService);
    debug(event: string, message: string, metadata?: Record<string, unknown>): void;
    info(event: string, message: string, metadata?: Record<string, unknown>): void;
    warn(event: string, message: string, metadata?: Record<string, unknown>): void;
    error(event: string, message: string, metadata?: Record<string, unknown>): void;
    private write;
}
