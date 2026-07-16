import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack1Controller } from "./enterprise-nervous-system-mega-pack-1.controller";
import { EnterpriseNervousSystemMegaPack1Service } from "./enterprise-nervous-system-mega-pack-1.service";
import { NervousSystemAuditService } from "./observability/nervous-system-audit.service";
import { NervousSystemContractRegistryService } from "./contracts/nervous-system-contract-registry.service";
import { NervousSystemTopicRegistryService } from "./topics/nervous-system-topic-registry.service";
import { NervousSystemEndpointRegistryService } from "./producers/nervous-system-endpoint-registry.service";
import { NervousSystemCorrelationService } from "./correlation/nervous-system-correlation.service";
import { NervousSystemDeliveryService } from "./delivery/nervous-system-delivery.service";
import { NervousSystemDeadLetterService } from "./dead-letter/nervous-system-dead-letter.service";
import { NervousSystemRetryService } from "./retry/nervous-system-retry.service";
import { NervousSystemEventBusService } from "./routing/nervous-system-event-bus.service";
import { NervousSystemHealthService } from "./health/nervous-system-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack1Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack1Service,
    NervousSystemAuditService,
    NervousSystemContractRegistryService,
    NervousSystemTopicRegistryService,
    NervousSystemEndpointRegistryService,
    NervousSystemCorrelationService,
    NervousSystemDeliveryService,
    NervousSystemDeadLetterService,
    NervousSystemRetryService,
    NervousSystemEventBusService,
    NervousSystemHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack1Service,
    NervousSystemAuditService,
    NervousSystemContractRegistryService,
    NervousSystemTopicRegistryService,
    NervousSystemEndpointRegistryService,
    NervousSystemCorrelationService,
    NervousSystemDeliveryService,
    NervousSystemDeadLetterService,
    NervousSystemRetryService,
    NervousSystemEventBusService,
    NervousSystemHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack1Module {}
