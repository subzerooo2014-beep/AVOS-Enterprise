import { RequestContext } from "../interfaces/request-context.interface";
export declare class RequestContextService {
    private readonly storage;
    run<T>(context: RequestContext, callback: () => T): T;
    get(): RequestContext | undefined;
    getCorrelationId(): string | undefined;
    getTraceId(): string | undefined;
}
