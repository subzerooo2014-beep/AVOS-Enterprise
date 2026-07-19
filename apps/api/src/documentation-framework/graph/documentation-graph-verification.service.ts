import { Injectable } from "@nestjs/common";
import { DocumentationGraphService } from "./documentation-graph.service";
import {
  DocumentationGraphVerificationCheck,
  DocumentationGraphVerificationReport,
} from "./documentation-graph.types";

@Injectable()
export class DocumentationGraphVerificationService {
  private latestReport: DocumentationGraphVerificationReport | null = null;

  constructor(private readonly graph: DocumentationGraphService) {}

  run(): DocumentationGraphVerificationReport {
    const snapshot = this.graph.snapshot();
    const nodeIds = new Set(snapshot.nodes.map((node) => node.id));

    const checks: DocumentationGraphVerificationCheck[] = [
      this.check("graph-version", snapshot.version.length > 0, "Graph version is defined."),
      this.check("graph-rebuilt", snapshot.rebuiltAt !== null, "Graph rebuild timestamp is available."),
      this.check("minimum-nodes", snapshot.nodes.length >= 6, "Graph contains the required documentation nodes."),
      this.check("minimum-links", snapshot.links.length >= 5, "Graph contains the required structural links."),
      this.check(
        "unique-node-identities",
        nodeIds.size === snapshot.nodes.length,
        "Every graph node has a unique identity.",
      ),
      this.check(
        "valid-link-sources",
        snapshot.links.every((link) => nodeIds.has(link.sourceId)),
        "All link sources resolve to registered nodes.",
      ),
      this.check(
        "valid-link-targets",
        snapshot.links.every((link) => nodeIds.has(link.targetId)),
        "All link targets resolve to registered nodes.",
      ),
      this.check(
        "human-final-authority",
        snapshot.nodes.every(
          (node) => node.metadata.humanFinalAuthority === true,
        ),
        "Human Final Authority is preserved across graph nodes.",
      ),
      this.check(
        "global-compliance-readiness-gate",
        snapshot.nodes.every(
          (node) => node.metadata.globalComplianceReadinessGate === true,
        ),
        "Global Compliance Readiness Gate is preserved.",
      ),
      this.check(
        "foundation-first",
        snapshot.nodes.every((node) => node.metadata.foundationFirst === true),
        "Foundation First is preserved across graph nodes.",
      ),
    ];

    const score = checks.reduce((total, check) => total + check.score, 0);
    const status = score === 100 ? "passed" : "failed";

    this.latestReport = {
      id: `documentation-graph-verification:${Date.now()}`,
      status,
      score,
      checks,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      verifiedAt: new Date().toISOString(),
    };

    return this.latestReport;
  }

  latest(): DocumentationGraphVerificationReport | null {
    return this.latestReport;
  }

  private check(
    name: string,
    passed: boolean,
    details: string,
  ): DocumentationGraphVerificationCheck {
    return {
      name,
      passed,
      score: passed ? 10 : 0,
      details,
    };
  }
}