import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { RepositoryDiscoveryService } from "./repository-discovery.service";
import type {
  RepositoryDependencyEdge,
  RepositoryMetadata,
  RepositoryRegistryHealth,
  RepositoryRegistryStats,
  RepositoryResolution,
} from "./repository-registry.types";

@Injectable()
export class RepositoryRegistryService implements OnModuleInit {
  private readonly repositories = new Map<string, RepositoryMetadata>();
  private lastDiscoveryAt?: string;

  constructor(
    private readonly discoveryService: RepositoryDiscoveryService,
  ) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): RepositoryMetadata[] {
    const sourceRoot = join(process.cwd(), "src");
    const discovered = this.discoveryService.discover(sourceRoot);

    this.repositories.clear();

    for (const repository of discovered) {
      this.repositories.set(repository.id, repository);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  register(metadata: RepositoryMetadata): RepositoryMetadata {
    const now = new Date().toISOString();

    const normalized: RepositoryMetadata = {
      ...metadata,
      discoveredAt: metadata.discoveredAt || now,
      updatedAt: now,
      dependencies: [...metadata.dependencies],
      capabilities: [...metadata.capabilities],
    };

    this.repositories.set(normalized.id, normalized);
    return { ...normalized };
  }

  list(): RepositoryMetadata[] {
    return Array.from(this.repositories.values())
      .map((item) => ({
        ...item,
        dependencies: [...item.dependencies],
        capabilities: [...item.capabilities],
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  findById(id: string): RepositoryMetadata | undefined {
    const repository = this.repositories.get(id);
    return repository
      ? {
          ...repository,
          dependencies: [...repository.dependencies],
          capabilities: [...repository.capabilities],
        }
      : undefined;
  }

  findByDomain(domain: string): RepositoryMetadata[] {
    return this.list().filter((item) => item.domain === domain);
  }

  resolve(token: string): RepositoryResolution {
    const repository = this.list().find(
      (item) =>
        item.token === token ||
        item.name === token ||
        item.id === token ||
        item.interfaceName === token,
    );

    if (!repository) {
      return {
        success: false,
        reason: `Repository '${token}' is not registered.`,
      };
    }

    return {
      success: true,
      repository,
    };
  }

  dependencyMap(): RepositoryDependencyEdge[] {
    const edges: RepositoryDependencyEdge[] = [];

    for (const repository of this.list()) {
      for (const dependency of repository.dependencies) {
        if (!dependency.includes("repository")) {
          continue;
        }

        edges.push({
          source: repository.id,
          target: dependency,
          type: "DEPENDS_ON",
        });
      }
    }

    return edges;
  }

  statistics(): RepositoryRegistryStats {
    const repositories = this.list();
    const domains = new Set(repositories.map((item) => item.domain));
    const versions = new Set(repositories.map((item) => item.version));

    return {
      totalRepositories: repositories.length,
      healthyRepositories: repositories.filter(
        (item) => item.healthStatus === "HEALTHY",
      ).length,
      degradedRepositories: repositories.filter(
        (item) => item.healthStatus === "DEGRADED",
      ).length,
      unknownRepositories: repositories.filter(
        (item) => item.healthStatus === "UNKNOWN",
      ).length,
      domains: domains.size,
      versions: versions.size,
    };
  }

  health(): RepositoryRegistryHealth {
    const statistics = this.statistics();

    return {
      success: true,
      system: "AVOS Enterprise Repository Registry",
      version: "1.0.0",
      status:
        statistics.degradedRepositories > 0 ||
        statistics.unknownRepositories > 0
          ? "DEGRADED"
          : "READY",
      statistics,
      lastDiscoveryAt: this.lastDiscoveryAt,
    };
  }
}
