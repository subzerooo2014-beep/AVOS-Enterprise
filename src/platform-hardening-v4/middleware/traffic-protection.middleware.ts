import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { TrafficDecision } from "../enums/traffic-decision.enum";
import { ResilienceStateService } from "../services/resilience-state.service";
import { TrafficProtectionService } from "../services/traffic-protection.service";

interface HttpRequestLike {
  method: string;
  originalUrl?: string;
  url?: string;
}

interface HttpResponseLike {
  statusCode: number;
  setHeader(
    name: string,
    value: string,
  ): void;
  end(body?: string): void;
  on(
    event: "finish" | "close",
    listener: () => void,
  ): void;
}

type NextFunctionLike = () => void;

@Injectable()
export class TrafficProtectionMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly traffic:
      TrafficProtectionService,
    private readonly resilience:
      ResilienceStateService,
  ) {}

  use(
    request: HttpRequestLike,
    response: HttpResponseLike,
    next: NextFunctionLike,
  ): void {
    const path =
      request.originalUrl ??
      request.url ??
      "/";

    const decision =
      this.traffic.evaluate(path);

    response.setHeader(
      "x-avos-resilience-mode",
      this.resilience.getMode(),
    );

    response.setHeader(
      "x-avos-traffic-decision",
      decision,
    );

    if (decision !== TrafficDecision.ALLOW) {
      this.reject(
        response,
        decision,
        path,
      );

      return;
    }

    this.traffic.beginRequest();

    let completed = false;

    const finish = () => {
      if (completed) {
        return;
      }

      completed = true;
      this.traffic.finishRequest();
    };

    response.on("finish", finish);
    response.on("close", finish);

    next();
  }

  private reject(
    response: HttpResponseLike,
    decision: TrafficDecision,
    path: string,
  ): void {
    const statusCode =
      decision === TrafficDecision.MAINTENANCE
        ? 503
        : decision ===
            TrafficDecision.EMERGENCY_BLOCK
          ? 503
          : 429;

    response.statusCode = statusCode;

    response.setHeader(
      "content-type",
      "application/json; charset=utf-8",
    );

    response.setHeader(
      "retry-after",
      decision === TrafficDecision.MAINTENANCE
        ? "300"
        : "60",
    );

    response.end(
      JSON.stringify({
        success: false,
        system:
          "AVOS Enterprise Production",
        message:
          this.getMessage(decision),
        decision,
        path,
        resilienceMode:
          this.resilience.getMode(),
        timestamp:
          new Date().toISOString(),
      }),
    );
  }

  private getMessage(
    decision: TrafficDecision,
  ): string {
    switch (decision) {
      case TrafficDecision.RATE_LIMIT:
        return "Request rate limit exceeded";
      case TrafficDecision.CONCURRENCY_LIMIT:
        return "Maximum concurrent request capacity reached";
      case TrafficDecision.LOAD_SHED:
        return "Request temporarily rejected to protect platform stability";
      case TrafficDecision.MAINTENANCE:
        return (
          this.resilience.getMaintenanceReason() ??
          "Platform maintenance is active"
        );
      case TrafficDecision.EMERGENCY_BLOCK:
        return "Emergency platform protection is active";
      default:
        return "Request rejected by AVOS traffic protection";
    }
  }
}
