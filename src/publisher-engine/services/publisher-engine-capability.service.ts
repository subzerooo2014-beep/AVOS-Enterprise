import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineCapabilityService {
  capabilities() {
    return [
      "queue",
      "routing",
      "dispatch",
      "metrics",
      "monitoring",
      "retry",
      "dead-letter",
      "audit",
      "lifecycle",
    ];
  }
}
