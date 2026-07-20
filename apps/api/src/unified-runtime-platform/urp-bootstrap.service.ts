import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UrpLifecycleManagerService } from "./urp-lifecycle-manager.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpBootstrapService implements OnApplicationBootstrap {
  private latest: Record<string, unknown> = { status: "not-booted" };

  constructor(
    private readonly lifecycle: UrpLifecycleManagerService,
    private readonly registry: UrpRuntimeRegistryService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.AVOS_URP_AUTO_BOOT === "false") return;
    this.latest = await this.lifecycle.bootAll();
  }

  boot() {
    return this.lifecycle.bootAll().then((result) => {
      this.latest = result;
      return result;
    });
  }

  status() {
    return {
      ...this.latest,
      registry: this.registry.snapshot(),
    };
  }
}