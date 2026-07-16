import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  ArchitectureLayerReview,
  CapabilityFabricConsolidationDecision,
} from "./capability-fabric-review.types";

@Injectable()
export class CapabilityFabricConsolidationService {
  decide(
    reviews: ArchitectureLayerReview[],
  ): CapabilityFabricConsolidationDecision[] {
    const decisions: CapabilityFabricConsolidationDecision[] = [];

    decisions.push(
      this.make(
        "KEEP",
        "CF-1 to CF-5 layer boundaries",
        "The five-layer separation matches the capability-first architecture.",
        "Preserve the current layer boundaries and enforce one-way dependencies.",
        100,
      ),
    );

    const incompleteExports = reviews.filter(
      (review) => review.findings.some(
        (finding) => finding.title.includes("export surface"),
      ),
    );

    if (incompleteExports.length > 0) {
      decisions.push(
        this.make(
          "STANDARDIZE",
          "Capability Fabric module exports",
          "Some layers do not expose the full canonical service contract.",
          "Create and enforce a canonical public export contract per layer.",
          95,
        ),
      );
    }

    const upwardDependency = reviews.some((review) =>
      review.findings.some((finding) =>
        finding.title.includes("upward dependencies"),
      ),
    );

    if (upwardDependency) {
      decisions.push(
        this.make(
          "HARDEN",
          "Dependency direction",
          "Foundation layers must never depend on higher layers.",
          "Introduce dependency-direction checks in CI and architecture validation.",
          100,
        ),
      );
    }

    decisions.push(
      this.make(
        "STANDARDIZE",
        "Capability status and lifecycle vocabulary",
        "All layers should consume one canonical lifecycle and status model.",
        "Keep lifecycle ownership in CF-1 and prohibit duplicate lifecycle enums in higher layers.",
        90,
      ),
    );

    decisions.push(
      this.make(
        "DOCUMENT",
        "Capability Fabric public API",
        "The API surface spans multiple controllers and requires a unified reference.",
        "Generate one Capability Fabric API map covering CF-1 through CF-5.",
        80,
      ),
    );

    decisions.push(
      this.make(
        "HARDEN",
        "Persistent storage boundary",
        "Foundation V1 services currently provide in-memory foundations.",
        "Introduce persistence adapters in a later production-hardening phase without changing domain contracts.",
        85,
      ),
    );

    decisions.push(
      this.make(
        "KEEP",
        "Human final authority",
        "CF-5 correctly preserves human approval over governed actions.",
        "Keep approval authority outside autonomous intelligence and orchestration.",
        100,
      ),
    );

    return decisions.sort((a, b) => b.priority - a.priority);
  }

  private make(
    type: CapabilityFabricConsolidationDecision["type"],
    target: string,
    rationale: string,
    action: string,
    priority: number,
  ): CapabilityFabricConsolidationDecision {
    return {
      id: randomUUID(),
      type,
      target,
      rationale,
      action,
      priority,
    };
  }
}