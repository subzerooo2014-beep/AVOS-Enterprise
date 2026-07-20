import { Injectable } from "@nestjs/common";
import { UrpRuntimeUnit } from "./urp.contracts";

@Injectable()
export class UrpRuntimeRegistryService {
  private readonly units = new Map<string, UrpRuntimeUnit>();

  register(
    input: Omit<UrpRuntimeUnit, "registeredAt" | "updatedAt">,
  ): UrpRuntimeUnit {
    const now = new Date().toISOString();
    const existing = this.units.get(input.key);

    const unit: UrpRuntimeUnit = {
      ...input,
      registeredAt: existing?.registeredAt ?? now,
      updatedAt: now,
    };

    this.units.set(unit.key, unit);
    return unit;
  }

  updateStatus(key: string, status: UrpRuntimeUnit["status"]) {
    const current = this.get(key);
    return this.register({ ...current, status });
  }

  get(key: string): UrpRuntimeUnit {
    const unit = this.units.get(key);
    if (!unit) throw new Error("URP unit not registered: " + key);
    return unit;
  }

  has(key: string): boolean {
    return this.units.has(key);
  }

  list(): UrpRuntimeUnit[] {
    return [...this.units.values()].sort((a, b) =>
      a.key.localeCompare(b.key),
    );
  }

  dependenciesOf(key: string): UrpRuntimeUnit[] {
    return this.get(key).dependencies.map((dependency) => this.get(dependency));
  }

  validateDependencies() {
    const findings: Array<Record<string, unknown>> = [];

    for (const unit of this.units.values()) {
      for (const dependency of unit.dependencies) {
        if (!this.units.has(dependency)) {
          findings.push({
            severity: "blocking",
            unit: unit.key,
            missingDependency: dependency,
          });
        }
      }
    }

    return {
      valid: findings.length === 0,
      units: this.units.size,
      findings,
      checkedAt: new Date().toISOString(),
    };
  }

  snapshot() {
    const units = this.list();
    return {
      total: units.length,
      operational: units.filter((unit) => unit.status === "operational").length,
      degraded: units.filter((unit) => unit.status === "degraded").length,
      failed: units.filter((unit) => unit.status === "failed").length,
      units,
    };
  }
}