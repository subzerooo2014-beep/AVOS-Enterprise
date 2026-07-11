import { Injectable } from "@nestjs/common";
import { PublisherFallbackService } from "./publisher-fallback.service";

@Injectable()
export class PublisherFailoverService {
  constructor(
    private readonly fallback: PublisherFallbackService,
  ) {}

  adapter(channel?: string | null) {
    return this.fallback.adapter(channel);
  }
}
