import { Injectable } from "@nestjs/common";

import {
  ExternalProviderChannel,
  ExternalProviderRequest,
} from "./external-provider.interface";

import { ExternalProviderRegistryService } from "./external-provider-registry.service";

@Injectable()
export class ExternalDeliveryService {
  constructor(
    private readonly registry: ExternalProviderRegistryService,
  ) {}

  deliver(
    request: ExternalProviderRequest,
  ) {
    return this.registry
      .get(request.channel)
      .deliver(request);
  }

  providers() {
    return this.registry.list();
  }

  health() {
    return this.registry.health();
  }

  configured(
    channel: ExternalProviderChannel,
  ): boolean {
    return this.registry
      .get(channel)
      .configured();
  }
}
