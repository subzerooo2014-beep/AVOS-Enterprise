import { Module } from "@nestjs/common";
import { SuperAppV5AuditService } from "./super-app-v5.audit.service";
import { SuperAppV5Controller } from "./super-app-v5.controller";
import { SuperAppV5IdempotencyService } from "./super-app-v5.idempotency.service";
import { SuperAppV5NotificationService } from "./super-app-v5.notification.service";
import { SuperAppV5QueueService } from "./super-app-v5.queue.service";
import { SuperAppV5RegistryService } from "./super-app-v5.registry.service";

@Module({
  controllers: [SuperAppV5Controller],
  providers: [
    SuperAppV5RegistryService,
    SuperAppV5IdempotencyService,
    SuperAppV5AuditService,
    SuperAppV5NotificationService,
    SuperAppV5QueueService,
  ],
  exports: [
    SuperAppV5RegistryService,
    SuperAppV5IdempotencyService,
    SuperAppV5AuditService,
    SuperAppV5NotificationService,
    SuperAppV5QueueService,
  ],
})
export class SuperAppV5Module {}
