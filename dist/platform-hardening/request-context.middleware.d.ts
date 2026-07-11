import { NestMiddleware } from "@nestjs/common";
export type AvosHeaderValue = string | string[] | undefined;
export interface AvosRequest {
    method?: string;
    url?: string;
    originalUrl?: string;
    headers?: Record<string, AvosHeaderValue>;
    requestId?: string;
    requestStartedAt?: number;
}
export interface AvosResponse {
    setHeader(name: string, value: string | number): void;
    removeHeader(name: string): void;
}
export type AvosNextFunction = () => void;
export declare class RequestContextMiddleware implements NestMiddleware {
    use(request: AvosRequest, response: AvosResponse, next: AvosNextFunction): void;
    private headerValue;
    private normalizeRequestId;
}
