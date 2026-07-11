import { NestMiddleware } from "@nestjs/common";
import { AvosNextFunction, AvosRequest, AvosResponse } from "./request-context.middleware";
export declare class SecurityHeadersMiddleware implements NestMiddleware {
    use(_request: AvosRequest, response: AvosResponse, next: AvosNextFunction): void;
}
