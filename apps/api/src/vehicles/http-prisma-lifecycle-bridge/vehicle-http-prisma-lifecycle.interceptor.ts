import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { VehicleLifecyclePrismaOrchestratorService } from "../lifecycle-prisma-integration/vehicle-lifecycle-prisma-orchestrator.service";

@Injectable()
export class VehicleHttpPrismaLifecycleInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly lifecycle: VehicleLifecyclePrismaOrchestratorService,
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
      /^\/vehicles(?:\/|$)/.test(url);

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
            source: `http-prisma:${method}:${url}`,
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

    for (const candidate of [
      record,
      record.vehicle,
      record.data,
      record.result,
    ]) {
      if (candidate && typeof candidate === "object") {
        const id = (candidate as Record<string, unknown>).id;

        if (typeof id === "string" || typeof id === "number") {
          return String(id);
        }
      }
    }

    return undefined;
  }

  private toPayload(value: unknown): Record<string, unknown> {
    return value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : { value };
  }
}
