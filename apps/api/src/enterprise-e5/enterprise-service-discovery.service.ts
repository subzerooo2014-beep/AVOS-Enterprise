import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseServiceDiscoveryService {
  private readonly services = new Map<
    string,
    {
      name: string;
      endpoint: string;
      healthy: boolean;
      registeredAt: string;
    }
  >();

  register(name: string, endpoint: string, healthy = true) {
    const service = {
      name,
      endpoint,
      healthy,
      registeredAt: new Date().toISOString(),
    };

    this.services.set(name, service);
    return service;
  }

  setHealth(name: string, healthy: boolean) {
    const service = this.services.get(name);
    if (!service) {
      return null;
    }

    service.healthy = healthy;
    return service;
  }

  list() {
    return [...this.services.values()];
  }

  count(): number {
    return this.services.size;
  }

  healthyCount(): number {
    return this.list().filter((item) => item.healthy).length;
  }
}