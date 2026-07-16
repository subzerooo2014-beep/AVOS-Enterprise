import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack2Controller } from "./enterprise-nervous-system-mega-pack-2.controller";
import { EnterpriseNervousSystemMegaPack2Service } from "./enterprise-nervous-system-mega-pack-2.service";
import { NervousRoutingAuditService } from "./observability/nervous-routing-audit.service";
import { NervousSignalRegistryService } from "./signals/nervous-signal-registry.service";
import { NervousTopicTaxonomyService } from "./taxonomy/nervous-topic-taxonomy.service";
import { NervousDeliveryPolicyService } from "./policies/nervous-delivery-policy.service";
import { NervousSubscriptionRegistryService } from "./subscriptions/nervous-subscription-registry.service";
import { NervousFilterEngineService } from "./filters/nervous-filter-engine.service";
import { NervousThrottlingService } from "./throttling/nervous-throttling.service";
import { NervousFanoutService } from "./fanout/nervous-fanout.service";
import { NervousIntelligentRoutingService } from "./routing/nervous-intelligent-routing.service";
import { NervousRoutingHealthService } from "./health/nervous-routing-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack2Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack2Service,
    NervousRoutingAuditService,
    NervousSignalRegistryService,
    NervousTopicTaxonomyService,
    NervousDeliveryPolicyService,
    NervousSubscriptionRegistryService,
    NervousFilterEngineService,
    NervousThrottlingService,
    NervousFanoutService,
    NervousIntelligentRoutingService,
    NervousRoutingHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack2Service,
    NervousRoutingAuditService,
    NervousSignalRegistryService,
    NervousTopicTaxonomyService,
    NervousDeliveryPolicyService,
    NervousSubscriptionRegistryService,
    NervousFilterEngineService,
    NervousThrottlingService,
    NervousFanoutService,
    NervousIntelligentRoutingService,
    NervousRoutingHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack2Module {}
