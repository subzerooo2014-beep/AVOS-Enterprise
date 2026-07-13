import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { VehicleLifecycleOrchestratorService } from "../lifecycle-integration/vehicle-lifecycle-orchestrator.service";

@Injectable()
export class VehicleHttpLifecycleInterceptor implements NestInterceptor {
  constructor(
    private readonly lifecycle: VehicleLifecycleOrchestratorService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method?: string;
      originalUrl?: string;
      url?: string;
      body?: Record<string, unknown>;
    }>();

    const method = String(request.method ?? "").toUpperCase();
    const url = String(request.originalUrl ?? request.url ?? "");

    const isVehicleWrite =
      ["POST", "PUT", "PATCH"].includes(method) &&
      /^\/vehicles(?:\/|$)/.test(url) &&
      !url.startsWith("/vehicle-lifecycle") &&
      !url.startsWith("/vehicle-brain-integration") &&
      !url.startsWith("/vehicle-intelligence-final");

    if (!isVehicleWrite) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((response) => {
        const vehicleId = this.resolveVehicleId(response);

        if (!vehicleId) {
          return;
        }

        void this.lifecycle
          .start({
            vehicleId,
            source: `http:${method}:${url}`,
            payload: {
              requestBody: request.body ?? {},
              response: this.toPayload(response),
            },
          })
          .catch(() => undefined);
      }),
    );
  }

  private resolveVehicleId(response: unknown): string | undefined {
    if (!response || typeof response !== "object") {
      return undefined;
    }

    const record = response as Record<string, unknown>;
    const directId = record.id;

    if (typeof directId === "string" || typeof directId === "number") {
      return String(directId);
    }

    for (const key of ["vehicle", "data", "result"]) {
      const nested = record[key];

      if (nested && typeof nested === "object") {
        const nestedId = (nested as Record<string, unknown>).id;

        if (
          typeof nestedId === "string" ||
          typeof nestedId === "number"
        ) {
          return String(nestedId);
        }
      }
    }

    return undefined;
  }

  private toPayload(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object") {
      return value as Record<string, unknown>;
    }

    return { value };
  }
}
