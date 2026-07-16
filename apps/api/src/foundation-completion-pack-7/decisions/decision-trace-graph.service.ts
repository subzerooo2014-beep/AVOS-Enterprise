import { BadRequestException, Injectable } from "@nestjs/common";
import { DecisionTraceEdge } from "../foundation-pack-7.types";
import { DecisionRegistryService } from "./decision-registry.service";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";

@Injectable()
export class DecisionTraceGraphService {
  private readonly edges = new Map<string, DecisionTraceEdge>();

  constructor(
    private readonly decisions: DecisionRegistryService,
    private readonly audit: TrustAuditLedgerService
  ) {}

  list() {
    return Array.from(this.edges.values());
  }

  link(input: {
    fromDecisionId: string;
    toDecisionId: string;
    relation: DecisionTraceEdge["relation"];
    reason: string;
    correlationId: string;
    actorIdentityId: string;
  }) {
    if (input.fromDecisionId === input.toDecisionId) {
      throw new BadRequestException(
        "A decision cannot trace to itself."
      );
    }

    this.decisions.get(input.fromDecisionId);
    this.decisions.get(input.toDecisionId);

    const duplicate = this.list().find(
      (edge) =>
        edge.fromDecisionId === input.fromDecisionId &&
        edge.toDecisionId === input.toDecisionId &&
        edge.relation === input.relation
    );

    if (duplicate) {
      return duplicate;
    }

    const edge: DecisionTraceEdge = {
      id: `decision-trace:${Date.now()}:${this.edges.size + 1}`,
      fromDecisionId: input.fromDecisionId,
      toDecisionId: input.toDecisionId,
      relation: input.relation,
      reason: input.reason,
      createdAt: new Date().toISOString()
    };

    this.edges.set(edge.id, edge);

    this.audit.record({
      correlationId: input.correlationId,
      category: "decision",
      action: "decision-trace-linked",
      subjectId: edge.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      after: {
        fromDecisionId: edge.fromDecisionId,
        toDecisionId: edge.toDecisionId,
        relation: edge.relation
      },
      metadata: {
        reason: edge.reason
      }
    });

    return edge;
  }

  graph(decisionId: string) {
    this.decisions.get(decisionId);

    const visited = new Set<string>();
    const queue = [decisionId];
    const decisions = [];
    const edges: DecisionTraceEdge[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId || visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      decisions.push(this.decisions.get(currentId));

      const related = this.list().filter(
        (edge) =>
          edge.fromDecisionId === currentId ||
          edge.toDecisionId === currentId
      );

      for (const edge of related) {
        if (!edges.some((candidate) => candidate.id === edge.id)) {
          edges.push(edge);
        }

        const otherId =
          edge.fromDecisionId === currentId
            ? edge.toDecisionId
            : edge.fromDecisionId;

        if (!visited.has(otherId)) {
          queue.push(otherId);
        }
      }
    }

    return {
      rootDecisionId: decisionId,
      decisions,
      edges
    };
  }

  summary() {
    return {
      totalEdges: this.edges.size,
      causal: this.list().filter(
        (edge) => edge.relation === "caused"
      ).length,
      reversed: this.list().filter(
        (edge) => edge.relation === "reversed"
      ).length,
      replayed: this.list().filter(
        (edge) => edge.relation === "replayed"
      ).length
    };
  }
}
