import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack5Controller } from "./enterprise-kernel-mega-pack-5.controller";
import { EnterpriseKernelMegaPack5Service } from "./enterprise-kernel-mega-pack-5.service";
import { KernelMessagingAuditService } from "./observability/kernel-messaging-audit.service";
import { KernelMessageContractRegistryService } from "./contracts/kernel-message-contract-registry.service";
import { KernelMessageFactoryService } from "./contracts/kernel-message-factory.service";
import { KernelSubscriptionRegistryService } from "./delivery/kernel-subscription-registry.service";
import { KernelDeadLetterService } from "./dead-letter/kernel-dead-letter.service";
import { KernelDeliveryService } from "./delivery/kernel-delivery.service";
import { KernelEventBusService } from "./events/kernel-event-bus.service";
import { KernelCommandBusService } from "./commands/kernel-command-bus.service";
import { KernelQueryBusService } from "./queries/kernel-query-bus.service";
import { KernelOrchestrationService } from "./orchestration/kernel-orchestration.service";
import { KernelMessagingHealthService } from "./health/kernel-messaging-health.service";

@Module({
  controllers: [EnterpriseKernelMegaPack5Controller],
  providers: [
    EnterpriseKernelMegaPack5Service,
    KernelMessagingAuditService,
    KernelMessageContractRegistryService,
    KernelMessageFactoryService,
    KernelSubscriptionRegistryService,
    KernelDeadLetterService,
    KernelDeliveryService,
    KernelEventBusService,
    KernelCommandBusService,
    KernelQueryBusService,
    KernelOrchestrationService,
    KernelMessagingHealthService
  ],
  exports: [
    EnterpriseKernelMegaPack5Service,
    KernelMessagingAuditService,
    KernelMessageContractRegistryService,
    KernelMessageFactoryService,
    KernelSubscriptionRegistryService,
    KernelDeadLetterService,
    KernelDeliveryService,
    KernelEventBusService,
    KernelCommandBusService,
    KernelQueryBusService,
    KernelOrchestrationService,
    KernelMessagingHealthService
  ]
})
export class EnterpriseKernelMegaPack5Module {}
