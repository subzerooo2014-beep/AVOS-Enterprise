import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpCertification } from "./agp.types";
import { AgpConstitutionService } from "./agp-constitution.service";
import { AgpMapsService } from "./agp-maps.service";

@Injectable()
export class AgpCertificationService {
  private latest?: AgpCertification;

  constructor(
    private readonly constitution: AgpConstitutionService,
    private readonly maps: AgpMapsService,
  ) {}

  certify(approvedBy: string): AgpCertification {
    if (!approvedBy?.trim()) throw new BadRequestException("approvedBy is required.");

    const architecture = this.constitution.reviewArchitecture();
    const gap = this.constitution.getGapAnalysis();
    const maps = this.maps.all();
    const checks: Record<string, boolean> = {
      architectureReview: architecture.status === "passed",
      gapAnalysis: gap.reusable.length > 0 && gap.missing.length > 0,
      capabilityMap: maps.capabilityMap.items.length > 0,
      serviceMap: maps.serviceMap.items.length > 0,
      engineMap: maps.engineMap.items.length > 0,
      dataMap: maps.dataMap.items.length > 0,
      integrationMap: maps.integrationMap.items.length > 0,
      megaPackRoadmap: maps.roadmap.items.length === 10,
      foundationFirst: architecture.principles.foundationFirst,
      capabilityFirst: architecture.principles.capabilityFirst,
      blueprintDriven: architecture.principles.blueprintDriven,
      humanFinalAuthority: architecture.principles.humanFinalAuthority,
      globalComplianceReadinessGate: architecture.principles.globalComplianceReadinessGate,
    };

    const blockingFindings = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
    const score = Math.round((Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100);

    this.latest = {
      id: `agp-certification:${randomUUID()}`,
      name: "AVOS Growth Platform (AGP) — Constitutional Mega Pack 0",
      version: "AGP-MP0-1.0.0",
      status: blockingFindings.length === 0 ? "certified" : "rejected",
      score,
      checks,
      blockingFindings,
      approvedBy,
      certifiedAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
    };
    return this.latest;
  }

  status() {
    return this.latest ?? {
      name: "AVOS Growth Platform (AGP) — Constitutional Mega Pack 0",
      version: "AGP-MP0-1.0.0",
      status: "not-certified",
      generatedAt: new Date().toISOString(),
    };
  }
}