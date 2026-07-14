import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { SuperAppV5AuditService } from "./super-app-v5.audit.service";
import { SuperAppV5NotificationService } from "./super-app-v5.notification.service";
import { SuperAppV5QueueService } from "./super-app-v5.queue.service";
import { SuperAppV5RegistryService } from "./super-app-v5.registry.service";

@Controller("super-app-v5")
export class SuperAppV5Controller {
  constructor(
    private readonly registry: SuperAppV5RegistryService,
    private readonly queue: SuperAppV5QueueService,
    private readonly audit: SuperAppV5AuditService,
    private readonly notifications: SuperAppV5NotificationService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Super App Phase 5",
      status: "healthy",
      capabilities: [
        "partner_registry",
        "credential_rotation",
        "background_jobs",
        "retry_queue",
        "dead_letter_queue",
        "idempotency",
        "correlation_ids",
        "audit_trail",
        "notifications",
        "operations_monitoring",
      ],
    };
  }

  @Post("credentials")
  registerCredential(
    @Body()
    body: {
      partnerId: string;
      keyId: string;
      secret: string;
    },
  ) {
    return {
      success: true,
      credential: this.registry.register(body),
    };
  }

  @Get("credentials")
  credentials() {
    return {
      success: true,
      credentials: this.registry.list(),
    };
  }

  @Patch("credentials/:id/rotate")
  rotateCredential(
    @Param("id") id: string,
    @Body() body: { secret: string },
  ) {
    return {
      success: true,
      credential: this.registry.rotate(id, body.secret),
    };
  }

  @Patch("credentials/:id/deactivate")
  deactivateCredential(@Param("id") id: string) {
    return {
      success: true,
      credential: this.registry.deactivate(id),
    };
  }

  @Post("jobs")
  enqueue(
    @Body()
    body: {
      idempotencyKey: string;
      correlationId?: string;
      partnerId: string;
      requestId: string;
      jobType: string;
      payload: Record<string, unknown>;
      maxAttempts?: number;
    },
  ) {
    return {
      success: true,
      ...this.queue.enqueue(body),
    };
  }

  @Get("jobs")
  jobs() {
    return {
      success: true,
      jobs: this.queue.list(),
    };
  }

  @Post("jobs/process-next")
  processNext() {
    return {
      success: true,
      job: this.queue.processNext(),
    };
  }

  @Patch("jobs/:id/fail")
  failJob(
    @Param("id") id: string,
    @Body() body: { error: string },
  ) {
    return {
      success: true,
      job: this.queue.fail(id, body.error),
    };
  }

  @Post("jobs/:id/requeue")
  requeue(@Param("id") id: string) {
    return {
      success: true,
      job: this.queue.retryDeadLetter(id),
    };
  }

  @Post("notifications")
  notify(
    @Body()
    body: {
      userId: string;
      title: string;
      message: string;
      channel?: "IN_APP" | "PUSH" | "EMAIL";
    },
  ) {
    return {
      success: true,
      notification: this.notifications.queue(body),
    };
  }

  @Get("notifications")
  notificationList() {
    return {
      success: true,
      notifications: this.notifications.list(),
    };
  }

  @Get("audit")
  auditEntries() {
    return {
      success: true,
      entries: this.audit.list(),
    };
  }

  @Get("operations/dashboard")
  dashboard() {
    return {
      success: true,
      dashboard: this.queue.dashboard(),
    };
  }
}
