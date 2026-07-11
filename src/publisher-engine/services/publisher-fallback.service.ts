import { Injectable } from "@nestjs/common";
import { PublisherRegistryService } from "../publisher-registry.service";

@Injectable()
export class PublisherFallbackService {
  constructor(
    private readonly registry: PublisherRegistryService,
  ) {}

  adapter(channel?: string | null) {
    try {
      return this.registry.get(channel ?? "internal");
    } catch {
      return this.registry.get("internal");
    }
  }
}
