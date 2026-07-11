"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PublisherEngineModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherEngineModule = exports.PUBLISHER_ADAPTERS = void 0;
const common_1 = require("@nestjs/common");
const ai_action_log_module_1 = require("../ai-action-log/ai-action-log.module");
const publisher_runtime_controller_1 = require("./publisher-runtime.controller");
const social_delivery_controller_1 = require("./social-delivery/social-delivery.controller");
const mock_social_delivery_controller_1 = require("./mock-delivery/mock-social-delivery.controller");
const mock_social_delivery_service_1 = require("./mock-delivery/mock-social-delivery.service");
const connector_credential_vault_service_1 = require("./connector-security/connector-credential-vault.service");
const connector_oauth_state_service_1 = require("./connector-security/connector-oauth-state.service");
const connector_rate_limiter_service_1 = require("./connector-security/connector-rate-limiter.service");
const connector_webhook_verification_service_1 = require("./connector-security/connector-webhook-verification.service");
const connector_security_controller_1 = require("./connector-security/connector-security.controller");
const webhook_receipt_service_1 = require("./webhook-runtime/webhook-receipt.service");
const webhook_receiver_controller_1 = require("./webhook-runtime/webhook-receiver.controller");
const publisher_enterprise_service_1 = require("./enterprise-runtime/publisher-enterprise.service");
const publisher_enterprise_controller_1 = require("./enterprise-runtime/publisher-enterprise.controller");
const publisher_operations_service_1 = require("./enterprise-runtime/publisher-operations.service");
const publisher_operations_controller_1 = require("./enterprise-runtime/publisher-operations.controller");
const publisher_versioning_service_1 = require("./enterprise-runtime/publisher-versioning.service");
const publisher_versioning_controller_1 = require("./enterprise-runtime/publisher-versioning.controller");
const publisher_advanced_analytics_service_1 = require("./enterprise-runtime/publisher-advanced-analytics.service");
const publisher_advanced_analytics_controller_1 = require("./enterprise-runtime/publisher-advanced-analytics.controller");
const publisher_reliability_analytics_service_1 = require("./enterprise-runtime/publisher-reliability-analytics.service");
const publisher_reliability_analytics_controller_1 = require("./enterprise-runtime/publisher-reliability-analytics.controller");
const publisher_final_enterprise_service_1 = require("./enterprise-runtime/publisher-final-enterprise.service");
const publisher_final_enterprise_controller_1 = require("./enterprise-runtime/publisher-final-enterprise.controller");
const publisher_dispatcher_service_1 = require("./publisher-dispatcher.service");
const publisher_registry_service_1 = require("./publisher-registry.service");
const website_publisher_1 = require("./adapters/website.publisher");
const crm_publisher_1 = require("./adapters/crm.publisher");
const dealer_publisher_1 = require("./adapters/dealer.publisher");
const buyer_publisher_1 = require("./adapters/buyer.publisher");
const export_publisher_1 = require("./adapters/export.publisher");
const internal_publisher_1 = require("./adapters/internal.publisher");
const instagram_publisher_1 = require("./adapters/instagram.publisher");
const tiktok_publisher_1 = require("./adapters/tiktok.publisher");
const google_search_publisher_1 = require("./adapters/google-search.publisher");
const publisher_retry_policy_service_1 = require("./services/publisher-retry-policy.service");
const publisher_circuit_breaker_service_1 = require("./services/publisher-circuit-breaker.service");
const publisher_runtime_metrics_service_1 = require("./services/publisher-runtime-metrics.service");
const publisher_dead_letter_service_1 = require("./services/publisher-dead-letter.service");
const publisher_job_reservation_service_1 = require("./services/publisher-job-reservation.service");
const publisher_dispatch_core_service_1 = require("./services/publisher-dispatch-core.service");
const publisher_context_builder_service_1 = require("./services/publisher-context-builder.service");
const publisher_result_normalizer_service_1 = require("./services/publisher-result-normalizer.service");
const vehicle_slug_service_1 = require("./website-runtime/vehicle-slug.service");
const vehicle_public_url_service_1 = require("./website-runtime/vehicle-public-url.service");
const vehicle_seo_metadata_service_1 = require("./website-runtime/vehicle-seo-metadata.service");
const website_search_index_service_1 = require("./website-runtime/website-search-index.service");
const website_sitemap_service_1 = require("./website-runtime/website-sitemap.service");
const website_publishing_service_1 = require("./website-runtime/website-publishing.service");
const publisher_vehicle_context_service_1 = require("./channel-runtimes/publisher-vehicle-context.service");
const publisher_platform_event_service_1 = require("./channel-runtimes/publisher-platform-event.service");
const crm_publisher_runtime_service_1 = require("./channel-runtimes/crm-publisher-runtime.service");
const dealer_publisher_runtime_service_1 = require("./channel-runtimes/dealer-publisher-runtime.service");
const buyer_matching_runtime_service_1 = require("./channel-runtimes/buyer-matching-runtime.service");
const export_publisher_runtime_service_1 = require("./channel-runtimes/export-publisher-runtime.service");
const internal_publisher_runtime_service_1 = require("./channel-runtimes/internal-publisher-runtime.service");
const social_content_builder_service_1 = require("./social-runtimes/social-content-builder.service");
const social_publication_event_service_1 = require("./social-runtimes/social-publication-event.service");
const instagram_publisher_runtime_service_1 = require("./social-runtimes/instagram-publisher-runtime.service");
const tiktok_publisher_runtime_service_1 = require("./social-runtimes/tiktok-publisher-runtime.service");
const google_search_publisher_runtime_service_1 = require("./social-runtimes/google-search-publisher-runtime.service");
const social_provider_configuration_service_1 = require("./social-delivery/social-provider-configuration.service");
const social_http_delivery_service_1 = require("./social-delivery/social-http-delivery.service");
const social_delivery_worker_service_1 = require("./social-delivery/social-delivery-worker.service");
const instagram_api_service_1 = require("./external-connectors/instagram/instagram-api.service");
const tiktok_api_service_1 = require("./external-connectors/tiktok/tiktok-api.service");
const google_ads_api_service_1 = require("./external-connectors/google/google-ads-api.service");
const external_provider_registry_service_1 = require("./external-connectors/external-provider-registry.service");
const external_delivery_service_1 = require("./external-connectors/external-delivery.service");
exports.PUBLISHER_ADAPTERS = Symbol("PUBLISHER_ADAPTERS");
const BUILT_IN_PUBLISHER_TYPES = [
    website_publisher_1.WebsitePublisher,
    crm_publisher_1.CrmPublisher,
    dealer_publisher_1.DealerPublisher,
    buyer_publisher_1.BuyerPublisher,
    export_publisher_1.ExportPublisher,
    internal_publisher_1.InternalPublisher,
    instagram_publisher_1.InstagramPublisher,
    tiktok_publisher_1.TikTokPublisher,
    google_search_publisher_1.GoogleSearchPublisher,
];
let PublisherEngineRegistryBootstrap = class PublisherEngineRegistryBootstrap {
    constructor(registry, adapters) {
        this.registry = registry;
        this.adapters = adapters;
        this.initialized = false;
    }
    onModuleInit() {
        if (this.initialized) {
            return;
        }
        for (const adapter of this.adapters) {
            if (!this.registry.exists(adapter.channel)) {
                this.registry.register(adapter, this.registrationOptions(adapter.channel));
            }
        }
        this.initialized = true;
    }
    registrationOptions(channel) {
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
};
PublisherEngineRegistryBootstrap = __decorate([
    __param(1, (0, common_1.Inject)(exports.PUBLISHER_ADAPTERS)),
    __metadata("design:paramtypes", [publisher_registry_service_1.PublisherRegistryService, Array])
], PublisherEngineRegistryBootstrap);
const BUILT_IN_ADAPTER_COLLECTION_PROVIDER = {
    provide: exports.PUBLISHER_ADAPTERS,
    inject: BUILT_IN_PUBLISHER_TYPES,
    useFactory: (...adapters) => adapters,
};
let PublisherEngineModule = PublisherEngineModule_1 = class PublisherEngineModule {
    static forRoot(options = {}) {
        const customPublisherTypes = options.publisherTypes ?? [];
        const customPublisherProviders = options.publisherProviders ?? [];
        const allPublisherTypes = [
            ...BUILT_IN_PUBLISHER_TYPES,
            ...customPublisherTypes,
        ];
        const customAdapterCollectionProvider = {
            provide: exports.PUBLISHER_ADAPTERS,
            inject: allPublisherTypes,
            useFactory: (...adapters) => adapters,
        };
        return {
            module: PublisherEngineModule_1,
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
    static registerPublishers(publisherTypes) {
        return PublisherEngineModule_1.forRoot({
            publisherTypes,
        });
    }
};
exports.PublisherEngineModule = PublisherEngineModule;
exports.PublisherEngineModule = PublisherEngineModule = PublisherEngineModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            ai_action_log_module_1.AiActionLogModule,
        ],
        controllers: [
            publisher_runtime_controller_1.PublisherRuntimeController,
            social_delivery_controller_1.SocialDeliveryController,
            mock_social_delivery_controller_1.MockSocialDeliveryController,
            connector_security_controller_1.ConnectorSecurityController,
            webhook_receiver_controller_1.WebhookReceiverController,
            publisher_enterprise_controller_1.PublisherEnterpriseController,
            publisher_operations_controller_1.PublisherOperationsController,
            publisher_versioning_controller_1.PublisherVersioningController,
            publisher_advanced_analytics_controller_1.PublisherAdvancedAnalyticsController,
            publisher_reliability_analytics_controller_1.PublisherReliabilityAnalyticsController,
            publisher_final_enterprise_controller_1.PublisherFinalEnterpriseController,
        ],
        providers: [
            publisher_registry_service_1.PublisherRegistryService,
            publisher_retry_policy_service_1.PublisherRetryPolicyService,
            publisher_circuit_breaker_service_1.PublisherCircuitBreakerService,
            publisher_runtime_metrics_service_1.PublisherRuntimeMetricsService,
            publisher_dead_letter_service_1.PublisherDeadLetterService,
            publisher_job_reservation_service_1.PublisherJobReservationService,
            publisher_context_builder_service_1.PublisherContextBuilderService,
            publisher_result_normalizer_service_1.PublisherResultNormalizerService,
            publisher_dispatch_core_service_1.PublisherDispatchCoreService,
            publisher_dispatcher_service_1.PublisherDispatcherService,
            vehicle_slug_service_1.VehicleSlugService,
            vehicle_public_url_service_1.VehiclePublicUrlService,
            vehicle_seo_metadata_service_1.VehicleSeoMetadataService,
            website_search_index_service_1.WebsiteSearchIndexService,
            website_sitemap_service_1.WebsiteSitemapService,
            website_publishing_service_1.WebsitePublishingService,
            publisher_vehicle_context_service_1.PublisherVehicleContextService,
            publisher_platform_event_service_1.PublisherPlatformEventService,
            crm_publisher_runtime_service_1.CrmPublisherRuntimeService,
            dealer_publisher_runtime_service_1.DealerPublisherRuntimeService,
            buyer_matching_runtime_service_1.BuyerMatchingRuntimeService,
            export_publisher_runtime_service_1.ExportPublisherRuntimeService,
            internal_publisher_runtime_service_1.InternalPublisherRuntimeService,
            social_content_builder_service_1.SocialContentBuilderService,
            social_publication_event_service_1.SocialPublicationEventService,
            instagram_publisher_runtime_service_1.InstagramPublisherRuntimeService,
            tiktok_publisher_runtime_service_1.TikTokPublisherRuntimeService,
            google_search_publisher_runtime_service_1.GoogleSearchPublisherRuntimeService,
            social_provider_configuration_service_1.SocialProviderConfigurationService,
            instagram_api_service_1.InstagramApiService,
            tiktok_api_service_1.TikTokApiService,
            google_ads_api_service_1.GoogleAdsApiService,
            external_provider_registry_service_1.ExternalProviderRegistryService,
            external_delivery_service_1.ExternalDeliveryService,
            social_http_delivery_service_1.SocialHttpDeliveryService,
            social_delivery_worker_service_1.SocialDeliveryWorkerService,
            mock_social_delivery_service_1.MockSocialDeliveryService,
            connector_credential_vault_service_1.ConnectorCredentialVaultService,
            connector_oauth_state_service_1.ConnectorOAuthStateService,
            connector_rate_limiter_service_1.ConnectorRateLimiterService,
            connector_webhook_verification_service_1.ConnectorWebhookVerificationService,
            webhook_receipt_service_1.WebhookReceiptService,
            publisher_enterprise_service_1.PublisherEnterpriseService,
            publisher_operations_service_1.PublisherOperationsService,
            publisher_versioning_service_1.PublisherVersioningService,
            publisher_advanced_analytics_service_1.PublisherAdvancedAnalyticsService,
            publisher_reliability_analytics_service_1.PublisherReliabilityAnalyticsService,
            publisher_final_enterprise_service_1.PublisherFinalEnterpriseService,
            website_publisher_1.WebsitePublisher,
            crm_publisher_1.CrmPublisher,
            dealer_publisher_1.DealerPublisher,
            buyer_publisher_1.BuyerPublisher,
            export_publisher_1.ExportPublisher,
            internal_publisher_1.InternalPublisher,
            instagram_publisher_1.InstagramPublisher,
            tiktok_publisher_1.TikTokPublisher,
            google_search_publisher_1.GoogleSearchPublisher,
            BUILT_IN_ADAPTER_COLLECTION_PROVIDER,
            PublisherEngineRegistryBootstrap,
        ],
        exports: [
            publisher_registry_service_1.PublisherRegistryService,
            publisher_retry_policy_service_1.PublisherRetryPolicyService,
            publisher_circuit_breaker_service_1.PublisherCircuitBreakerService,
            publisher_runtime_metrics_service_1.PublisherRuntimeMetricsService,
            publisher_dead_letter_service_1.PublisherDeadLetterService,
            publisher_job_reservation_service_1.PublisherJobReservationService,
            publisher_dispatch_core_service_1.PublisherDispatchCoreService,
            publisher_dispatcher_service_1.PublisherDispatcherService,
            vehicle_slug_service_1.VehicleSlugService,
            vehicle_public_url_service_1.VehiclePublicUrlService,
            vehicle_seo_metadata_service_1.VehicleSeoMetadataService,
            website_search_index_service_1.WebsiteSearchIndexService,
            website_sitemap_service_1.WebsiteSitemapService,
            website_publishing_service_1.WebsitePublishingService,
            exports.PUBLISHER_ADAPTERS,
            website_publisher_1.WebsitePublisher,
            crm_publisher_1.CrmPublisher,
            dealer_publisher_1.DealerPublisher,
            buyer_publisher_1.BuyerPublisher,
            export_publisher_1.ExportPublisher,
            internal_publisher_1.InternalPublisher,
            instagram_publisher_1.InstagramPublisher,
            tiktok_publisher_1.TikTokPublisher,
            google_search_publisher_1.GoogleSearchPublisher,
        ],
    })
], PublisherEngineModule);
//# sourceMappingURL=publisher-engine.module.js.map