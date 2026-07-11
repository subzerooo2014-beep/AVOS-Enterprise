import { NestMiddleware } from "@nestjs/common";
import { ResilienceStateService } from "../services/resilience-state.service";
import { TrafficProtectionService } from "../services/traffic-protection.service";
interface HttpRequestLike {
    method: string;
    originalUrl?: string;
    url?: string;
}
interface HttpResponseLike {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(body?: string): void;
    on(event: "finish" | "close", listener: () => void): void;
}
type NextFunctionLike = () => void;
export declare class TrafficProtectionMiddleware implements NestMiddleware {
    private readonly traffic;
    private readonly resilience;
    constructor(traffic: TrafficProtectionService, resilience: ResilienceStateService);
    use(request: HttpRequestLike, response: HttpResponseLike, next: NextFunctionLike): void;
    private reject;
    private getMessage;
}
export {};
