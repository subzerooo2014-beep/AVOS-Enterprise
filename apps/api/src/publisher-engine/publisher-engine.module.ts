import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleInit,
  Provider,
  Type,
} from "@nestjs/common";

import { AiActionLogModule } from "../ai-action-log/ai-action-log.module";
import { PublisherRuntimeController } from "./publisher-runtime.controller";
import { SocialDeliveryController } from "./social-delivery/social-delivery.controller";
import { MockSocialDeliveryController } from "./mock-delivery/mock-social-delivery.controller";
import { MockSocialDeliveryService } from "./mock-delivery/mock-social-delivery.service";
import { ConnectorCredentialVaultService } from "./connector-security/connector-credential-vault.service";
import { ConnectorOAuthStateService } from "./connector-security/connector-oauth-state.service";
import { ConnectorRateLimiterService } from "./connector-security/connector-rate-limiter.service";
import { ConnectorWebhookVerificationService } from "./connector-security/connector-webhook-verification.service";
import { ConnectorSecurityController } from "./connector-security/connector-security.controller";
import { WebhookReceiptService } from "./webhook-runtime/webhook-receipt.service";
import { WebhookReceiverController } from "./webhook-runtime/webhook-receiver.controller";
import { PublisherEnterpriseService } from "./enterprise-runtime/publisher-enterprise.service";
import { PublisherEnterpriseController } from "./enterprise-runtime/publisher-enterprise.controller";
import { PublisherOperationsService } from "./enterprise-runtime/publisher-operations.service";
import { PublisherOperationsController } from "./enterprise-runtime/publisher-operations.controller";
import { PublisherVersioningService } from "./enterprise-runtime/publisher-versioning.service";
import { PublisherVersioningController } from "./enterprise-runtime/publisher-versioning.controller";
import { PublisherAdvancedAnalyticsService } from "./enterprise-runtime/publisher-advanced-analytics.service";
import { PublisherAdvancedAnalyticsController } from "./enterprise-runtime/publisher-advanced-analytics.controller";
import { PublisherReliabilityAnalyticsService } from "./enterprise-runtime/publisher-reliability-analytics.service";
import { PublisherReliabilityAnalyticsController } from "./enterprise-runtime/publisher-reliability-analytics.controller";
import { PublisherFinalEnterpriseService } from "./enterprise-runtime/publisher-final-enterprise.service";
import { PublisherFinalEnterpriseController } from "./enterprise-runtime/publisher-final-enterprise.controller";
import { PublisherDispatcherService } from "./publisher-dispatcher.service";

import {
  PublisherAdapter,
  PublisherRegistryService,
} from "./publisher-registry.service";

import { WebsitePublisher } from "./adapters/website.publisher";
import { CrmPublisher } from "./adapters/crm.publisher";
import { DealerPublisher } from "./adapters/dealer.publisher";
import { BuyerPublisher } from "./adapters/buyer.publisher";
import { ExportPublisher } from "./adapters/export.publisher";
import { InternalPublisher } from "./adapters/internal.publisher";
import { InstagramPublisher } from "./adapters/instagram.publisher";
import { TikTokPublisher } from "./adapters/tiktok.publisher";
import { GoogleSearchPublisher } from "./adapters/google-search.publisher";

import { PublisherRetryPolicyService } from "./services/publisher-retry-policy.service";
import { PublisherCircuitBreakerService } from "./services/publisher-circuit-breaker.service";
import { PublisherRuntimeMetricsService } from "./services/publisher-runtime-metrics.service";
import { PublisherDeadLetterService } from "./services/publisher-dead-letter.service";
import { PublisherJobReservationService } from "./services/publisher-job-reservation.service";
import { PublisherDispatchCoreService } from "./services/publisher-dispatch-core.service";
import { PublisherContextBuilderService } from "./services/publisher-context-builder.service";
import { PublisherResultNormalizerService } from "./services/publisher-result-normalizer.service";
import { VehicleSlugService } from "./website-runtime/vehicle-slug.service";
import { VehiclePublicUrlService } from "./website-runtime/vehicle-public-url.service";
import { VehicleSeoMetadataService } from "./website-runtime/vehicle-seo-metadata.service";
import { WebsiteSearchIndexService } from "./website-runtime/website-search-index.service";
import { WebsiteSitemapService } from "./website-runtime/website-sitemap.service";
import { WebsitePublishingService } from "./website-runtime/website-publishing.service";
import { PublisherVehicleContextService } from "./channel-runtimes/publisher-vehicle-context.service";
import { PublisherPlatformEventService } from "./channel-runtimes/publisher-platform-event.service";
import { CrmPublisherRuntimeService } from "./channel-runtimes/crm-publisher-runtime.service";
import { DealerPublisherRuntimeService } from "./channel-runtimes/dealer-publisher-runtime.service";
import { BuyerMatchingRuntimeService } from "./channel-runtimes/buyer-matching-runtime.service";
import { ExportPublisherRuntimeService } from "./channel-runtimes/export-publisher-runtime.service";
import { InternalPublisherRuntimeService } from "./channel-runtimes/internal-publisher-runtime.service";
import { SocialContentBuilderService } from "./social-runtimes/social-content-builder.service";
import { SocialPublicationEventService } from "./social-runtimes/social-publication-event.service";
import { InstagramPublisherRuntimeService } from "./social-runtimes/instagram-publisher-runtime.service";
import { TikTokPublisherRuntimeService } from "./social-runtimes/tiktok-publisher-runtime.service";
import { GoogleSearchPublisherRuntimeService } from "./social-runtimes/google-search-publisher-runtime.service";
import { SocialProviderConfigurationService } from "./social-delivery/social-provider-configuration.service";
import { SocialHttpDeliveryService } from "./social-delivery/social-http-delivery.service";
import { SocialDeliveryWorkerService } from "./social-delivery/social-delivery-worker.service";
import { InstagramApiService } from "./external-connectors/instagram/instagram-api.service";
import { TikTokApiService } from "./external-connectors/tiktok/tiktok-api.service";
import { GoogleAdsApiService } from "./external-connectors/google/google-ads-api.service";
import { ExternalProviderRegistryService } from "./external-connectors/external-provider-registry.service";
import { ExternalDeliveryService } from "./external-connectors/external-delivery.service";

export const PUBLISHER_ADAPTERS = Symbol(
  "PUBLISHER_ADAPTERS",
);

const BUILT_IN_PUBLISHER_TYPES: Type<PublisherAdapter>[] = [
  WebsitePublisher,
  CrmPublisher,
  DealerPublisher,
  BuyerPublisher,
  ExportPublisher,
  InternalPublisher,
  InstagramPublisher,
  TikTokPublisher,
  GoogleSearchPublisher,
];

class PublisherEngineRegistryBootstrap
  implements OnModuleInit
{
  private initialized = false;

  constructor(
    private readonly registry: PublisherRegistryService,

    @Inject(PUBLISHER_ADAPTERS)
    private readonly adapters: PublisherAdapter[],
  ) {}

  onModuleInit(): void {
    if (this.initialized) {
      return;
    }

    for (const adapter of this.adapters) {
      if (!this.registry.exists(adapter.channel)) {
        this.registry.register(
          adapter,
          this.registrationOptions(adapter.channel),
        );
      }
    }

    this.initialized = true;
  }

  private registrationOptions(
    channel: string,
  ): {
    aliases: string[];
    displayName: string;
  } {
    switch (channel) {
      case "website":
        return {
          aliases: [
            "web",
            "marketplace",
            "avos_website",
          ],
          displayName: "AVOS Website",
        };

      case "crm_leads":
        return {
          aliases: [
            "crm",
            "leads",
            "customer_relationship",
          ],
          displayName: "AVOS CRM Leads",
        };

      case "dealer_network":
        return {
          aliases: [
            "dealer",
            "dealers",
            "dealer_portal",
          ],
          displayName: "AVOS Dealer Network",
        };

      case "matched_buyers":
        return {
          aliases: [
            "buyers",
            "buyer_matching",
            "matched_buyers_network",
          ],
          displayName: "AVOS Matched Buyers",
        };

      case "gcc_export":
        return {
          aliases: [
            "export",
            "gcc",
            "export_network",
          ],
          displayName: "AVOS GCC Export",
        };

      case "internal":
        return {
          aliases: [
            "system",
            "avos_internal",
          ],
          displayName: "AVOS Internal",
        };

      case "instagram":
        return {
          aliases: [
            "ig",
            "instagram_ads",
            "meta_instagram",
          ],
          displayName: "AVOS Instagram",
        };

      case "tiktok":
        return {
          aliases: [
            "tt",
            "tiktok_ads",
            "tiktok_business",
          ],
          displayName: "AVOS TikTok",
        };

      case "google_search":
        return {
          aliases: [
            "google",
            "search",
            "google_ads",
            "sem",
          ],
          displayName: "AVOS Google Search",
        };

      default:
        return {
          aliases: [],
          displayName: channel,
        };
    }
  }
}

const BUILT_IN_ADAPTER_COLLECTION_PROVIDER: Provider = {
  provide: PUBLISHER_ADAPTERS,
  inject: BUILT_IN_PUBLISHER_TYPES,
  useFactory: (
    ...adapters: PublisherAdapter[]
  ): PublisherAdapter[] => adapters,
};

export interface PublisherEngineModuleOptions {
  global?: boolean;
  publisherProviders?: Provider[];
  publisherTypes?: Type<PublisherAdapter>[];
}

@Global()
@Module({
  imports: [
    AiActionLogModule,
  ],

  controllers: [
    PublisherRuntimeController,
    SocialDeliveryController,
    MockSocialDeliveryController,
    ConnectorSecurityController,
    WebhookReceiverController,
    PublisherEnterpriseController,
    PublisherOperationsController,
    PublisherVersioningController,
    PublisherAdvancedAnalyticsController,
    PublisherReliabilityAnalyticsController,
    PublisherFinalEnterpriseController,
  ],

  providers: [
    PublisherRegistryService,

    PublisherRetryPolicyService,
    PublisherCircuitBreakerService,
    PublisherRuntimeMetricsService,
    PublisherDeadLetterService,
    PublisherJobReservationService,

    PublisherContextBuilderService,
    PublisherResultNormalizerService,
    PublisherDispatchCoreService,
    PublisherDispatcherService,

    VehicleSlugService,
    VehiclePublicUrlService,
    VehicleSeoMetadataService,
    WebsiteSearchIndexService,
    WebsiteSitemapService,
    WebsitePublishingService,

    PublisherVehicleContextService,
    PublisherPlatformEventService,
    CrmPublisherRuntimeService,
    DealerPublisherRuntimeService,
    BuyerMatchingRuntimeService,
    ExportPublisherRuntimeService,
    InternalPublisherRuntimeService,

    SocialContentBuilderService,
    SocialPublicationEventService,
    InstagramPublisherRuntimeService,
    TikTokPublisherRuntimeService,
    GoogleSearchPublisherRuntimeService,

    SocialProviderConfigurationService,

    InstagramApiService,
    TikTokApiService,
    GoogleAdsApiService,
    ExternalProviderRegistryService,
    ExternalDeliveryService,

    SocialHttpDeliveryService,
    SocialDeliveryWorkerService,
    MockSocialDeliveryService,

    ConnectorCredentialVaultService,
    ConnectorOAuthStateService,
    ConnectorRateLimiterService,
    ConnectorWebhookVerificationService,
    WebhookReceiptService,

    PublisherEnterpriseService,
    PublisherOperationsService,
    PublisherVersioningService,
    PublisherAdvancedAnalyticsService,
    PublisherReliabilityAnalyticsService,
    PublisherFinalEnterpriseService,

    WebsitePublisher,
    CrmPublisher,
    DealerPublisher,
    BuyerPublisher,
    ExportPublisher,
    InternalPublisher,
    InstagramPublisher,
    TikTokPublisher,
    GoogleSearchPublisher,

    BUILT_IN_ADAPTER_COLLECTION_PROVIDER,
    PublisherEngineRegistryBootstrap,
  ],

  exports: [
    PublisherRegistryService,

    PublisherRetryPolicyService,
    PublisherCircuitBreakerService,
    PublisherRuntimeMetricsService,
    PublisherDeadLetterService,
    PublisherJobReservationService,

    PublisherDispatchCoreService,
    PublisherDispatcherService,

    VehicleSlugService,
    VehiclePublicUrlService,
    VehicleSeoMetadataService,
    WebsiteSearchIndexService,
    WebsiteSitemapService,
    WebsitePublishingService,

    PUBLISHER_ADAPTERS,

    WebsitePublisher,
    CrmPublisher,
    DealerPublisher,
    BuyerPublisher,
    ExportPublisher,
    InternalPublisher,
    InstagramPublisher,
    TikTokPublisher,
    GoogleSearchPublisher,
  ],
})
export class PublisherEngineModule {
  static forRoot(
    options: PublisherEngineModuleOptions = {},
  ): DynamicModule {
    const customPublisherTypes =
      options.publisherTypes ?? [];

    const customPublisherProviders =
      options.publisherProviders ?? [];

    const allPublisherTypes = [
      ...BUILT_IN_PUBLISHER_TYPES,
      ...customPublisherTypes,
    ];

    const customAdapterCollectionProvider: Provider = {
      provide: PUBLISHER_ADAPTERS,
      inject: allPublisherTypes,
      useFactory: (
        ...adapters: PublisherAdapter[]
      ): PublisherAdapter[] => adapters,
    };

    return {
      module: PublisherEngineModule,
      global: options.global ?? true,

      providers: [
        ...customPublisherProviders,
        ...customPublisherTypes,
        customAdapterCollectionProvider,
      ],

      exports: [
        ...customPublisherTypes,
      ],
    };
  }

  static registerPublishers(
    publisherTypes: Type<PublisherAdapter>[],
  ): DynamicModule {
    return PublisherEngineModule.forRoot({
      publisherTypes,
    });
  }
}
















