import { NestMiddleware } from "@nestjs/common";
import { RequestContextService } from "../services/request-context.service";
interface HttpRequestLike {
    method: string;
    originalUrl?: string;
    url?: string;
    ip?: string;
    headers: Record<string, string | string[] | undefined>;
}
interface HttpResponseLike {
    setHeader(name: string, value: string): void;
}
type NextFunctionLike = () => void;
export declare class RequestCorrelationMiddleware implements NestMiddleware {
    private readonly requestContext;
    constructor(requestContext: RequestContextService);
    use(request: HttpRequestLike, response: HttpResponseLike, next: NextFunctionLike): void;
    private readHeader;
}
export {};
