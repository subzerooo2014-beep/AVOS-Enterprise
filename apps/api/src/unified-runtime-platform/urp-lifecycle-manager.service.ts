import { Injectable } from "@nestjs/common";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpLifecycleManagerService {
  constructor(private readonly registry: UrpRuntimeRegistryService) {}

  async start(key: string) {
    const unit = this.registry.get(key);
    for (const dependency of unit.dependencies) {
      const dependencyUnit = this.registry.get(dependency);
      if (dependencyUnit.status !== "operational") {
        throw new Error(
          "Cannot start " + key + "; dependency is not operational: " + dependency,
        );
      }
    }

    this.registry.updateStatus(key, "starting");
    return this.registry.updateStatus(key, "operational");
  }

  stop(key: string) {
    this.registry.updateStatus(key, "stopping");
    return this.registry.updateStatus(key, "stopped");
  }

  async bootAll() {
    const pending = new Set(this.registry.list().map((unit) => unit.key));
    const booted: string[] = [];

    while (pending.size > 0) {
      let progressed = false;

      for (const key of [...pending]) {
        const unit = this.registry.get(key);
        const ready = unit.dependencies.every(
          (dependency) =>
            this.registry.get(dependency).status === "operational",
        );

        if (!ready) continue;

        await this.start(key);
        pending.delete(key);
        booted.push(key);
        progressed = true;
      }

      if (!progressed) {
        throw new Error(
          "URP boot deadlock. Remaining units: " + [...pending].join(", "),
        );
      }
    }

    return {
      status: "operational",
      booted,
      snapshot: this.registry.snapshot(),
      bootedAt: new Date().toISOString(),
    };
  }
}