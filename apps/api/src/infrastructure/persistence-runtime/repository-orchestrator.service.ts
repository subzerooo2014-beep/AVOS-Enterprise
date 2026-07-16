import { Injectable, NotFoundException } from "@nestjs/common";
import { RepositoryRegistryService } from "../repository-registry/repository-registry.service";
import { PersistenceCacheService } from "./persistence-cache.service";
import { PersistenceEventsService } from "./persistence-events.service";

@Injectable()
export class RepositoryOrchestratorService {
  constructor(
    private readonly registry: RepositoryRegistryService,
    private readonly cache: PersistenceCacheService,
    private readonly events: PersistenceEventsService,
  ) {}

  resolve(repositoryToken: string) {
    const cacheKey = `repository:${repositoryToken}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return {
        success: true,
        source: "CACHE",
        repository: cached,
      };
    }

    const resolution = this.registry.resolve(repositoryToken);

    if (!resolution.success || !resolution.repository) {
      throw new NotFoundException(resolution.reason);
    }

    this.cache.set(cacheKey, resolution.repository, 60_000);
    this.events.emit(
      "RepositoryResolved",
      "RepositoryRegistry",
      {
        token: repositoryToken,
        repositoryId: resolution.repository.id,
      },
      resolution.repository.id,
    );

    return {
      success: true,
      source: "REGISTRY",
      repository: resolution.repository,
    };
  }

  domains() {
    const repositories = this.registry.list();
    const grouped = new Map<string, number>();

    for (const repository of repositories) {
      grouped.set(
        repository.domain,
        (grouped.get(repository.domain) ?? 0) + 1,
      );
    }

    return Array.from(grouped.entries())
      .map(([domain, repositoriesCount]) => ({
        domain,
        repositoriesCount,
      }))
      .sort((a, b) => a.domain.localeCompare(b.domain));
  }
}
