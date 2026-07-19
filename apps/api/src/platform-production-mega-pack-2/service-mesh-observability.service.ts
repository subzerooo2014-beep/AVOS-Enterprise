import { Injectable } from "@nestjs/common";
import {
  ServiceHealthSnapshot,
  ServiceObservation,
} from "./platform-production-mega-pack-2.types";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";
import { EnterpriseServiceRegistryService } from "./enterprise-service-registry.service";

@Injectable()
export class ServiceMeshObservabilityService {
  constructor(
    private readonly store: ServiceMeshFileStoreService,
    private readonly registry: EnterpriseServiceRegistryService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  record(
    input: Omit<ServiceObservation, "id" | "recordedAt">,
  ): ServiceObservation {
    const observation: ServiceObservation = {
      ...input,
      id: this.id("service-observation"),
      recordedAt: this.now(),
    };

    this.store.writeJson(
      `observations/${observation.id}.json`,
      observation,
    );

    return observation;
  }

  list(serviceKey?: string): ServiceObservation[] {
    const observations =
      this.store.listJson<ServiceObservation>("observations");

    return serviceKey
      ? observations.filter(
          (observation) => observation.serviceKey === serviceKey,
        )
      : observations;
  }

  health(): ServiceHealthSnapshot {
    const instances = this.registry.list();
    const serviceKeys = [...new Set(instances.map((item) => item.serviceKey))];

    const services = serviceKeys.map((serviceKey) => {
      const group = instances.filter(
        (instance) => instance.serviceKey === serviceKey,
      );
      const healthy = group.filter(
        (instance) =>
          ["healthy", "certified"].includes(instance.status) &&
          instance.healthScore >= 90,
      );

      return {
        serviceKey,
        healthyInstances: healthy.length,
        totalInstances: group.length,
        averageHealthScore: Math.round(
          group.reduce(
            (sum, instance) => sum + instance.healthScore,
            0,
          ) / group.length,
        ),
      };
    });

    const blockingIssues = services
      .filter(
        (service) =>
          service.healthyInstances === 0 ||
          service.averageHealthScore < 90,
      )
      .map(
        (service) =>
          `${service.serviceKey} has ${service.healthyInstances}/${service.totalInstances} healthy instances.`,
      );

    const score =
      services.length === 0
        ? 0
        : Math.round(
            services.reduce(
              (sum, service) => sum + service.averageHealthScore,
              0,
            ) / services.length,
          );

    const snapshot: ServiceHealthSnapshot = {
      id: this.id("service-health"),
      score,
      state:
        score >= 90 && blockingIssues.length === 0
          ? "healthy"
          : score >= 60
            ? "degraded"
            : "critical",
      services,
      blockingIssues,
      createdAt: this.now(),
    };

    this.store.writeJson(`health/${snapshot.id}.json`, snapshot);
    this.store.writeJson("health/latest.json", snapshot);

    return snapshot;
  }

  latestHealth(): ServiceHealthSnapshot | null {
    return this.store.readJson<ServiceHealthSnapshot | null>(
      "health/latest.json",
      null,
    );
  }
}