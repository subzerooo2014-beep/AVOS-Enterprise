import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack2Service } from "./enterprise-nervous-system-mega-pack-2.service";
import { NervousSignalRegistryService } from "./signals/nervous-signal-registry.service";
import { NervousTopicTaxonomyService } from "./taxonomy/nervous-topic-taxonomy.service";
import { NervousSubscriptionRegistryService } from "./subscriptions/nervous-subscription-registry.service";
import { NervousDeliveryPolicyService } from "./policies/nervous-delivery-policy.service";
import { NervousIntelligentRoutingService } from "./routing/nervous-intelligent-routing.service";
import { NervousThrottlingService } from "./throttling/nervous-throttling.service";
import { NervousFanoutService } from "./fanout/nervous-fanout.service";
import { NervousRoutingHealthService } from "./health/nervous-routing-health.service";
import { NervousRoutingAuditService } from "./observability/nervous-routing-audit.service";
import {
  NervousDeliveryPolicy,
  NervousSignalDefinition,
  NervousSubscription,
  NervousTopicTaxonomyNode
} from "./enterprise-nervous-system-mega-pack-2.types";

@Controller("enterprise-nervous-system-v2")
export class EnterpriseNervousSystemMegaPack2Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack2Service,
    private readonly signals: NervousSignalRegistryService,
    private readonly taxonomy: NervousTopicTaxonomyService,
    private readonly subscriptions: NervousSubscriptionRegistryService,
    private readonly policies: NervousDeliveryPolicyService,
    private readonly routing: NervousIntelligentRoutingService,
    private readonly throttling: NervousThrottlingService,
    private readonly fanout: NervousFanoutService,
    private readonly health: NervousRoutingHealthService,
    private readonly audit: NervousRoutingAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("signals")
  signalDefinitions() {
    return {
      summary: this.signals.summary(),
      items: this.signals.list()
    };
  }

  @Post("signals")
  registerSignal(
    @Body()
    body: {
      definition: Omit<
        NervousSignalDefinition,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.signals.register(
      body.definition,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("taxonomy")
  taxonomyList() {
    return {
      summary: this.taxonomy.summary(),
      items: this.taxonomy.list()
    };
  }

  @Post("taxonomy")
  registerTaxonomyNode(
    @Body()
    body: {
      node: Omit<
        NervousTopicTaxonomyNode,
        "createdAt" | "updatedAt" | "childrenIds" | "level"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.taxonomy.register(
      body.node,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("subscriptions")
  subscriptionList() {
    return {
      summary: this.subscriptions.summary(),
      items: this.subscriptions.list()
    };
  }

  @Post("subscriptions")
  registerSubscription(
    @Body()
    body: {
      subscription: Omit<
        NervousSubscription,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.subscriptions.register(
      body.subscription,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("delivery-policies")
  deliveryPolicyList() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Post("delivery-policies")
  registerDeliveryPolicy(
    @Body()
    body: {
      policy: Omit<
        NervousDeliveryPolicy,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.policies.register(
      body.policy,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("routing/signals")
  createSignal(
    @Body()
    body: {
      definitionId: string;
      sourceId: string;
      payload: unknown;
      headers?: Record<string, string>;
      correlationId: string;
      traceId?: string;
      causationId?: string;
      ttlSeconds?: number;
      actorIdentityId: string;
    }
  ) {
    return this.routing.createSignal(body);
  }

  @Post("routing/signals/:id/route")
  routeSignal(
    @Param("id") id: string,
    @Body()
    body: {
      humanApproved: boolean;
      actorIdentityId: string;
    }
  ) {
    return this.routing.route({
      signalId: id,
      ...body
    });
  }

  @Get("routing")
  routingState() {
    return {
      summary: this.routing.summary(),
      signals: this.routing.listSignals(),
      results: this.routing.listResults()
    };
  }

  @Get("throttling")
  throttlingState() {
    return {
      summary: this.throttling.summary(),
      items: this.throttling.list()
    };
  }

  @Get("fanout")
  fanoutState() {
    return {
      summary: this.fanout.summary(),
      items: this.fanout.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
