import { Injectable } from "@nestjs/common";
import type { FoundationCompatibilityResultV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationVersionCompatibilityV1Service {
  check(
    currentVersion: string,
    requiredRange: string,
  ): FoundationCompatibilityResultV1 {
    const reasons: string[] = [];
    const currentMajor = this.major(currentVersion);
    const requiredMajor = this.major(requiredRange.replace(/^[^0-9]*/, ""));

    const compatible =
      requiredMajor === null ||
      currentMajor === null ||
      currentMajor === requiredMajor;

    if (!compatible) {
      reasons.push(
        `Major version mismatch: current=${currentVersion}, required=${requiredRange}.`,
      );
    }

    if (compatible) {
      reasons.push("Version compatibility check passed.");
    }

    return {
      compatible,
      currentVersion,
      requiredRange,
      reasons,
    };
  }

  private major(version: string): number | null {
    const match = version.match(/^(\d+)/);

    if (!match) {
      return null;
    }

    return Number(match[1]);
  }
}
