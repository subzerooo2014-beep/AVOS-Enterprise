import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductionRuntimeRegistryService {
  private readonly registeredComponents = new Set<string>();

  register(component: string) {
    this.registeredComponents.add(component);

    return {
      component,
      registered: true,
      registeredComponents: this.registeredComponents.size,
    };
  }

  getStatus() {
    return {
      status: 'operational',
      registeredComponents: Array.from(this.registeredComponents),
      total: this.registeredComponents.size,
    };
  }
}