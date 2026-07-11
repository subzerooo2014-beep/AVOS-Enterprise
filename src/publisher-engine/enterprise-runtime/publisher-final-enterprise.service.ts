import {
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherRuntimeMetricsService } from "../services/publisher-runtime-metrics.service";
import { PublisherCircuitBreakerService } from "../services/publisher-circuit-breaker.service";
import { PublisherAdvancedAnalyticsService } from "./publisher-advanced-analytics.service";
import { PublisherReliabilityAnalyticsService } from "./publisher-reliability-analytics.service";
import { SocialDeliveryWorkerService } from "../social-delivery/social-delivery-worker.service";
import { ExternalDeliveryService } from "../external-connectors/external-delivery.service";

@Injectable()
export class PublisherFinalEnterpriseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: PublisherRegistryService,
    private readonly runtimeMetrics: PublisherRuntimeMetricsService,
    private readonly circuitBreaker: PublisherCircuitBreakerService,
    private readonly advancedAnalytics: PublisherAdvancedAnalyticsService,
    private readonly reliabilityAnalytics: PublisherReliabilityAnalyticsService,
    private readonly socialWorker: SocialDeliveryWorkerService,
    private readonly externalDelivery: ExternalDeliveryService,
  ) {}

  async liveMetrics() {
    const [
      queued,
      processing,
      retrying,
      failed,
      dead,
      delivered,
    ] = await Promise.all([
      this.countByStatuses([
        "queued",
      ]),

      this.countByStatuses([
        "processing",
      ]),

      this.countByStatuses([
        "retrying",
      ]),

      this.countByStatuses([
        "failed",
        "rejected",
      ]),

      this.countByStatuses([
        "dead",
      ]),

      this.countByStatuses([
        "delivered",
      ]),
    ]);

    return {
      success: true,

      engine: {
        name:
          "PublisherEngineEnterprise",
        version:
          "v2-enterprise",
      },

      queue: {
        queued,
        processing,
        retrying,
        failed,
        dead,
        delivered,

        pending:
          queued +
          processing +
          retrying,
      },

      worker:
        this.socialWorker.status(),

      providers:
        this.externalDelivery.providers(),

      runtimeMetrics:
        this.runtimeMetrics.summary(),

      circuits:
        this.circuitBreaker.snapshot(),

      channels:
        this.registry.list(),

      generatedAt:
        new Date(),
    };
  }

  async operationsHealth() {
    const live =
      await this.liveMetrics();

    const providerHealth =
      await this.externalDelivery.health();

    const unhealthyProviders =
      providerHealth.filter(
        (item: any) =>
          item.status !==
          "healthy",
      );

    const openCircuits =
      Array.isArray(
        live.circuits,
      )
        ? live.circuits.filter(
            (item: any) =>
              item.state ===
              "open",
          )
        : [];

    const queuePressure =
      live.queue.pending;

    const risk =
      openCircuits.length > 0 ||
      live.queue.dead > 0
        ? "high"
        : queuePressure > 100 ||
            unhealthyProviders.length > 0
          ? "medium"
          : "low";

    return {
      success: true,

      status:
        risk === "high"
          ? "degraded"
          : "healthy",

      risk,

      checks: {
        workerRunning:
          live.worker.running,

        automaticPolling:
          live.worker.automaticPolling,

        providersHealthy:
          unhealthyProviders.length ===
          0,

        openCircuits:
          openCircuits.length,

        queuePressure,

        deadLetters:
          live.queue.dead,

        failedEvents:
          live.queue.failed,
      },

      providerHealth,

      unhealthyProviders,

      circuits:
        live.circuits,

      recommendations:
        this.healthRecommendations({
          queuePressure,
          deadLetters:
            live.queue.dead,
          failedEvents:
            live.queue.failed,
          openCircuits:
            openCircuits.length,
          unhealthyProviders:
            unhealthyProviders.length,
        }),

      checkedAt:
        new Date(),
    };
  }

  async executiveSummary() {
    const [
      dashboard,
      kpis,
      sla,
      ranking,
      failures,
      health,
    ] = await Promise.all([
      this.advancedAnalytics.dashboard(),
      this.advancedAnalytics.kpis(),
      this.reliabilityAnalytics.slaReport(),
      this.reliabilityAnalytics.reliabilityRanking(),
      this.reliabilityAnalytics.failureTrends(),
      this.operationsHealth(),
    ]);

    return {
      success: true,

      title:
        "AVOS Publisher Engine Executive Summary",

      overallStatus:
        health.status,

      operationalRisk:
        health.risk,

      overview:
        dashboard.overview,

      kpis:
        kpis.kpis,

      sla:
        sla.overall,

      bestChannel:
        ranking.bestChannel,

      weakestChannel:
        ranking.weakestChannel,

      failures:
        failures.totals,

      recommendations:
        [
          ...health.recommendations,

          ...this.executiveRecommendations({
            successRate:
              dashboard.overview.successRate,

            receiptCoverageRate:
              dashboard.overview.receiptCoverageRate,

            averageAttempts:
              dashboard.overview.averageAttempts,

            versionedPublicationRate:
              dashboard.overview.versionedPublicationRate,
          }),
        ],

      generatedAt:
        new Date(),
    };
  }

  async productionReadiness() {
    const [
      health,
      dashboard,
      sla,
    ] = await Promise.all([
      this.operationsHealth(),
      this.advancedAnalytics.dashboard(),
      this.reliabilityAnalytics.slaReport(),
    ]);

    const providers =
      this.externalDelivery.providers();

    const configuredProviders =
      providers.filter(
        (item: any) =>
          item.configured,
      );

    const checks = [
      {
        name:
          "publisher_channels_registered",
        passed:
          this.registry.list()
            .length > 0,
      },

      {
        name:
          "social_worker_enabled",
        passed:
          this.socialWorker.status()
            .automaticPolling === true,
      },

      {
        name:
          "all_providers_configured",
        passed:
          configuredProviders.length ===
          providers.length,
      },

      {
        name:
          "no_open_circuits",
        passed:
          health.checks.openCircuits ===
          0,
      },

      {
        name:
          "no_dead_letters",
        passed:
          health.checks.deadLetters ===
          0,
      },

      {
        name:
          "sla_compliant",
        passed:
          sla.overall.sla.compliant ===
          true,
      },

      {
        name:
          "success_rate_acceptable",
        passed:
          dashboard.overview
            .successRate >= 95,
      },

      {
        name:
          "receipt_tracking_available",
        passed:
          dashboard.overview
            .receiptCoverageRate > 0,
      },

      {
        name:
          "latency_metrics_available",
        passed:
          dashboard.overview
            .averageDeliveryDurationMs >=
          0,
      },

      {
        name:
          "mock_mode_disabled",
        passed:
          String(
            process.env
              .PUBLISHER_DELIVERY_MODE ??
            "mock",
          ).toLowerCase() ===
          "production",
      },

      {
        name:
          "webhook_signature_required",
        passed:
          String(
            process.env
              .WEBHOOK_SIGNATURE_REQUIRED ??
            "false",
          ).toLowerCase() ===
          "true",
      },
    ];

    const passed =
      checks.filter(
        (item) =>
          item.passed,
      ).length;

    const failed =
      checks.length -
      passed;

    const score =
      Number(
        (
          passed /
          checks.length *
          100
        ).toFixed(2),
      );

    return {
      success: true,

      ready:
        failed === 0,

      readinessScore:
        score,

      environment:
        String(
          process.env.NODE_ENV ??
          "development",
        ),

      deliveryMode:
        String(
          process.env
            .PUBLISHER_DELIVERY_MODE ??
          "mock",
        ),

      checks,

      totals: {
        checks:
          checks.length,
        passed,
        failed,
      },

      blockingIssues:
        checks
          .filter(
            (item) =>
              !item.passed,
          )
          .map(
            (item) =>
              item.name,
          ),

      note:
        failed === 0
          ? "Publisher Engine is ready for production deployment."
          : "Publisher Engine is operational, but production blockers remain.",

      checkedAt:
        new Date(),
    };
  }

  async finalReport() {
    const [
      live,
      health,
      executive,
      readiness,
    ] = await Promise.all([
      this.liveMetrics(),
      this.operationsHealth(),
      this.executiveSummary(),
      this.productionReadiness(),
    ]);

    return {
      success: true,

      system:
        "AVOS Publisher Engine Enterprise",

      completion: {
        publisherEngine:
          "complete",

        enterpriseAnalytics:
          "complete",

        versioning:
          "complete",

        replayAndClone:
          "complete",

        webhookReceipts:
          "complete",

        reliability:
          "complete",

        productionConnectors:
          readiness.ready
            ? "ready"
            : "pending_real_credentials",
      },

      live,
      health,
      executive,
      productionReadiness:
        readiness,

      generatedAt:
        new Date(),
    };
  }

  private async countByStatuses(
    statuses: string[],
  ): Promise<number> {
    return (this.prisma as any).platformEvent.count({
      where: {
        type: {
          in:
            this.publicationEventTypes(),
        },

        status: {
          in:
            statuses,
        },
      },
    });
  }

  private publicationEventTypes():
    string[] {
    return [
      "InstagramVehiclePublicationRequested",
      "TikTokVehiclePublicationRequested",
      "GoogleSearchVehicleCampaignRequested",
    ];
  }

  private healthRecommendations(
    input: {
      queuePressure: number;
      deadLetters: number;
      failedEvents: number;
      openCircuits: number;
      unhealthyProviders: number;
    },
  ): string[] {
    const items: string[] = [];

    if (
      input.queuePressure > 100
    ) {
      items.push(
        "Increase worker concurrency or inspect queue congestion.",
      );
    }

    if (
      input.deadLetters > 0
    ) {
      items.push(
        "Review and replay dead-letter publication events.",
      );
    }

    if (
      input.failedEvents > 0
    ) {
      items.push(
        "Inspect recent connector and webhook failures.",
      );
    }

    if (
      input.openCircuits > 0
    ) {
      items.push(
        "Investigate channels with open circuit breakers.",
      );
    }

    if (
      input.unhealthyProviders > 0
    ) {
      items.push(
        "Verify external provider credentials and availability.",
      );
    }

    if (
      items.length === 0
    ) {
      items.push(
        "No immediate operational action is required.",
      );
    }

    return items;
  }

  private executiveRecommendations(
    input: {
      successRate: number;
      receiptCoverageRate: number;
      averageAttempts: number;
      versionedPublicationRate: number;
    },
  ): string[] {
    const items: string[] = [];

    if (
      input.successRate < 99
    ) {
      items.push(
        "Improve publication success rate before scaling paid campaigns.",
      );
    }

    if (
      input.receiptCoverageRate < 90
    ) {
      items.push(
        "Increase webhook receipt coverage for stronger delivery confirmation.",
      );
    }

    if (
      input.averageAttempts > 2
    ) {
      items.push(
        "Review retry policy and external provider stability.",
      );
    }

    if (
      input.versionedPublicationRate < 50
    ) {
      items.push(
        "Increase publication versioning coverage before enabling AI A/B testing.",
      );
    }

    return items;
  }
}

