import { Injectable } from '@nestjs/common';
import { ServiceCatalogItem } from './service-provider-marketplace.types';

@Injectable()
export class ServiceCatalogEngineService {
  private readonly items = new Map<string, ServiceCatalogItem>();

  register(item: ServiceCatalogItem) {
    this.items.set(item.id, { ...item });
    return { ...item };
  }

  list(activeOnly = true) {
    return [...this.items.values()]
      .filter((item) => !activeOnly || item.active)
      .map((item) => ({ ...item }));
  }
}