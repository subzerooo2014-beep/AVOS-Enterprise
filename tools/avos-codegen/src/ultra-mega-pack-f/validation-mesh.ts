import { UltraFFinding, UltraFSeverity } from "./contracts";

export interface ValidationNode {
  key: string;
  category: "build" | "test" | "security" | "architecture" | "compliance";
  required: boolean;
  score: number;
}

export interface ValidationMeshResult {
  passed: boolean;
  score: number;
  failedNodes: string[];
  findings: UltraFFinding[];
  validatedAt: string;
}

export class ContinuousValidationMesh {
  validate(nodes: readonly ValidationNode[]): ValidationMeshResult {
    const findings: UltraFFinding[] = [];
    const failedNodes: string[] = [];

    for (const node of nodes) {
      if (node.score < 70) {
        failedNodes.push(node.key);
        findings.push({
          code: "VALIDATION_NODE_FAILED",
          severity: node.required
            ? UltraFSeverity.ERROR
            : UltraFSeverity.WARNING,
          message: `Validation node ${node.key} failed its threshold.`,
          subject: node.key,
          metadata: {
            category: node.category,
            score: node.score,
            required: node.required,
          },
        });
      }
    }

    const score =
      nodes.length === 0
        ? 100
        : Math.round(
            nodes.reduce((sum, node) => sum + node.score, 0) / nodes.length,
          );

    return {
      passed:
        failedNodes.length === 0 ||
        nodes
          .filter((node) => node.required)
          .every((node) => node.score >= 70),
      score,
      failedNodes,
      findings,
      validatedAt: new Date().toISOString(),
    };
  }
}
