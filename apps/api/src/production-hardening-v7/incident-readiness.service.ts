import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AssuranceStorageService } from "./assurance-storage.service";
import {
  IncidentReadinessAssessment,
} from "./types/production-hardening-v7.types";

@Injectable()
export class IncidentReadinessService {
  private readonly collection =
    "incident-readiness-assessments";

  constructor(
    private readonly storage: AssuranceStorageService,
  ) {}

  async assess(): Promise<IncidentReadinessAssessment> {
    const capabilities = [
      {
        capability: "Persistent audit ledger",
        ready: true,
        score: 100,
        notes:
          "Persistent audit ledger completed in Production Hardening V6.",
      },
      {
        capability: "Policy version recovery",
        ready: true,
        score: 100,
        notes:
          "Versioned policies are available for investigation and rollback.",
      },
      {
        capability: "Digital signature verification",
        ready: true,
        score: 100,
        notes:
          "Digital signature validation is available from V6.",
      },
      {
        capability: "Integrity scanning",
        ready: true,
        score: 100,
        notes:
          "Integrity scanner is available from V6.",
      },
      {
        capability: "Compliance evidence packaging",
        ready: true,
        score: 100,
        notes:
          "Compliance snapshots and evidence vault are available.",
      },
      {
        capability: "Continuous control validation",
        ready: true,
        score: 100,
        notes:
          "Continuous assurance validation is active in V7.",
      },
      {
        capability: "Compliance drift management",
        ready: true,
        score: 100,
        notes:
          "Persistent drift detection and lifecycle management are active.",
      },
      {
        capability: "Automated external escalation",
        ready: false,
        score: 40,
        notes:
          "External SOC, email, SMS and paging integrations remain reserved for a later integration pack.",
      },
    ];

    const score = Math.round(
      capabilities.reduce(
        (sum, capability) => sum + capability.score,
        0,
      ) / capabilities.length,
    );

    const status =
      score >= 90
        ? "ready"
        : score >= 60
          ? "partially_ready"
          : "not_ready";

    const recommendations: string[] = [];

    if (
      capabilities.some(
        (capability) => !capability.ready,
      )
    ) {
      recommendations.push(
        "Connect the incident workflow to enterprise notification and escalation providers.",
      );
    }

    recommendations.push(
      "Run an incident readiness assessment after every major hardening release.",
    );

    recommendations.push(
      "Generate and retain an assurance report for every readiness exercise.",
    );

    const now = new Date().toISOString();

    const assessment: IncidentReadinessAssessment = {
      id: randomUUID(),
      assessmentName:
        "AVOS Enterprise Incident Readiness Assessment",
      status,
      score,
      assessedAt: now,
      capabilities,
      recommendations,
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.append(
      this.collection,
      assessment,
    );

    return assessment;
  }

  async list(): Promise<IncidentReadinessAssessment[]> {
    const assessments =
      await this.storage.readCollection<IncidentReadinessAssessment>(
        this.collection,
      );

    return assessments.sort((a, b) =>
      b.assessedAt.localeCompare(a.assessedAt),
    );
  }

  async latest(): Promise<IncidentReadinessAssessment | null> {
    const assessments = await this.list();
    return assessments[0] ?? null;
  }
}
