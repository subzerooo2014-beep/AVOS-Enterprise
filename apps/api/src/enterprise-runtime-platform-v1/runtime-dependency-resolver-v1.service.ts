import { Injectable } from "@nestjs/common";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";

@Injectable()
export class RuntimeDependencyResolverV1Service {
  constructor(private readonly services: RuntimeServiceRegistryV1Service) {}

  resolve(serviceId: string): {
    resolved: boolean;
    order: string[];
    missing: string[];
    circular: string[];
  } {
    const order: string[] = [];
    const missing: string[] = [];
    const circular: string[] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (id: string): void => {
      if (visited.has(id)) return;

      if (visiting.has(id)) {
        circular.push(id);
        return;
      }

      visiting.add(id);

      let service;
      try {
        service = this.services.get(id);
      } catch {
        missing.push(id);
        visiting.delete(id);
        return;
      }

      for (const dependency of service.dependencies) {
        visit(dependency);
      }

      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    visit(serviceId);

    return {
      resolved: missing.length === 0 && circular.length === 0,
      order,
      missing: Array.from(new Set(missing)),
      circular: Array.from(new Set(circular)),
    };
  }
}
