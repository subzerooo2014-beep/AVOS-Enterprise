import { Injectable } from "@nestjs/common";
import { PlatformLifecycleState } from "../contracts/unified-platform.types";
import { UnifiedPlatformFoundationService } from "../foundation/unified-platform-foundation.service";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";

@Injectable()
export class UnifiedPlatformControllerService {
  private state: PlatformLifecycleState = "created";
  private bootedAt: string | null = null;
  private lastTransitionAt = new Date().toISOString();

  constructor(
    private readonly foundation: UnifiedPlatformFoundationService,
    private readonly registry: UnifiedPlatformRegistryService
  ) {}

  boot() {
    this.transition("booting");
    if (this.registry.list("suite").length === 0) {
      this.registry.seedDefaults();
    }
    this.bootedAt = new Date().toISOString();
    this.transition("operational");
    return this.status();
  }

  shutdown() {
    this.transition("stopping");
    this.transition("stopped");
    return this.status();
  }

  restart() {
    this.shutdown();
    return this.boot();
  }

  coordinate() {
    return {
      status: this.state === "operational" ? "coordinated" : "unavailable",
      platformState: this.state,
      registry: this.registry.summary(),
      coordinatedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      ...this.foundation.getManifest(),
      status: this.state,
      bootedAt: this.bootedAt,
      lastTransitionAt: this.lastTransitionAt,
      registry: this.registry.summary()
    };
  }

  private transition(next: PlatformLifecycleState) {
    this.state = next;
    this.lastTransitionAt = new Date().toISOString();
  }
}