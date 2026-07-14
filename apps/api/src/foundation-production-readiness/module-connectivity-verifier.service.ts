import { Injectable } from '@nestjs/common';
import { FoundationModule } from './foundation-production-readiness.types';

@Injectable()
export class ModuleConnectivityVerifierService {
  verify(modules: FoundationModule[]) {
    const ids = new Set(modules.map((module) => module.id));

    const links = modules.flatMap((module) =>
      module.dependencies.map((dependency) => ({
        from: module.id,
        to: dependency,
        connected: ids.has(dependency),
      })),
    );

    return {
      links,
      connectivityScore: Math.round(
        (links.filter((link) => link.connected).length /
          Math.max(1, links.length)) *
          100,
      ),
      brokenLinks: links
        .filter((link) => !link.connected)
        .map((link) => `${link.from}->${link.to}`),
    };
  }
}