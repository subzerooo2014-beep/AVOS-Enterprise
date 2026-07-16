import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationUpdateReleaseV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationUpdateOsV1Service {
  private readonly releases = new Map<string, FoundationUpdateReleaseV1>();

  create(
    version: string,
    channel: FoundationUpdateReleaseV1["channel"],
    compatibilityRange: string,
    artifacts: string[],
  ): FoundationUpdateReleaseV1 {
    const now = new Date().toISOString();

    const release: FoundationUpdateReleaseV1 = {
      id: `foundation-release-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      version,
      channel,
      status: "DRAFT",
      compatibilityRange,
      artifacts: [...artifacts],
      createdAt: now,
      updatedAt: now,
    };

    this.releases.set(release.id, release);
    return this.clone(release);
  }

  transition(
    id: string,
    status: FoundationUpdateReleaseV1["status"],
  ): FoundationUpdateReleaseV1 {
    const release = this.releases.get(id);

    if (!release) {
      throw new NotFoundException(`Release '${id}' was not found.`);
    }

    release.status = status;
    release.updatedAt = new Date().toISOString();
    return this.clone(release);
  }

  list(): FoundationUpdateReleaseV1[] {
    return Array.from(this.releases.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.releases.size;
  }

  private clone(item: FoundationUpdateReleaseV1): FoundationUpdateReleaseV1 {
    return { ...item, artifacts: [...item.artifacts] };
  }
}
