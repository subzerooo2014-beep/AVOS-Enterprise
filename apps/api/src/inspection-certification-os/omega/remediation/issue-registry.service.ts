import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  RemediationIssue,
  RemediationSeverity,
  RemediationStatus,
} from "./omega-remediation.types";

@Injectable()
export class IssueRegistryService {
  private readonly issues = new Map<string, RemediationIssue>();

  create(input: {
    readonly findingId: string;
    readonly title: string;
    readonly severity: RemediationSeverity;
    readonly riskScore: number;
    readonly owner?: string;
    readonly dueAt?: string;
    readonly tags?: readonly string[];
  }): RemediationIssue {
    const timestamp = new Date().toISOString();

    const issue: RemediationIssue = {
      issueId: `OMEGA-ISSUE-${randomUUID()}`,
      findingId: input.findingId,
      title: input.title,
      severity: input.severity,
      riskScore: input.riskScore,
      status: "open",
      createdAt: timestamp,
      updatedAt: timestamp,
      owner: input.owner,
      dueAt: input.dueAt,
      tags: input.tags ?? [],
    };

    this.issues.set(issue.issueId, issue);
    return issue;
  }

  updateStatus(
    issueId: string,
    status: RemediationStatus,
  ): RemediationIssue {
    const current = this.issues.get(issueId);

    if (!current) {
      throw new Error(`Remediation issue not found: ${issueId}`);
    }

    const updated: RemediationIssue = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.issues.set(issueId, updated);
    return updated;
  }

  get(issueId: string): RemediationIssue | null {
    return this.issues.get(issueId) ?? null;
  }

  all(): readonly RemediationIssue[] {
    return [...this.issues.values()];
  }

  clear(): void {
    this.issues.clear();
  }
}
