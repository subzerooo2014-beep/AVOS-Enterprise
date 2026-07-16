import { Injectable } from "@nestjs/common";
import {
  GraphTraversalRequest,
  GraphTraversalResult,
  KnowledgeRelationship
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "../relationships/knowledge-relationship-registry.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeGraphTraversalService {
  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  traverse(
    request: GraphTraversalRequest,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ): GraphTraversalResult {
    this.nodes.get(request.startNodeId);

    const visited = new Set<string>();
    const relationshipIds = new Set<string>();
    const paths: string[][] = [];
    const queue: Array<{
      nodeId: string;
      depth: number;
      path: string[];
    }> = [
      {
        nodeId: request.startNodeId,
        depth: 0,
        path: [request.startNodeId]
      }
    ];

    let maxDepthReached = 0;

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        continue;
      }

      if (visited.has(current.nodeId)) {
        continue;
      }

      visited.add(current.nodeId);
      maxDepthReached = Math.max(
        maxDepthReached,
        current.depth
      );

      if (current.depth >= request.maxDepth) {
        paths.push(current.path);
        continue;
      }

      const relations = this.relationsFor(
        current.nodeId,
        request.direction
      ).filter((relationship) =>
        request.relationshipTypes
          ? request.relationshipTypes.includes(
              relationship.type
            )
          : true
      );

      if (relations.length === 0) {
        paths.push(current.path);
      }

      for (const relationship of relations) {
        relationshipIds.add(relationship.id);

        const nextId =
          relationship.fromNodeId === current.nodeId
            ? relationship.toNodeId
            : relationship.fromNodeId;

        if (!visited.has(nextId)) {
          queue.push({
            nodeId: nextId,
            depth: current.depth + 1,
            path: [...current.path, nextId]
          });
        }
      }
    }

    const nodeIds = Array.from(visited).filter(
      (id) =>
        request.includeStartNode ||
        id !== request.startNodeId
    );

    const result: GraphTraversalResult = {
      startNodeId: request.startNodeId,
      nodeIds,
      relationshipIds: Array.from(relationshipIds),
      paths,
      maxDepthReached,
      traversedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: context.correlationId,
      category: "traversal",
      action: "knowledge-graph-traversed",
      subjectId: request.startNodeId,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        nodes: result.nodeIds.length,
        relationships: result.relationshipIds.length,
        maxDepthReached
      }
    });

    return result;
  }

  shortestPath(
    fromNodeId: string,
    toNodeId: string
  ) {
    this.nodes.get(fromNodeId);
    this.nodes.get(toNodeId);

    const visited = new Set<string>();
    const queue: string[][] = [[fromNodeId]];

    while (queue.length > 0) {
      const path = queue.shift();

      if (!path) {
        continue;
      }

      const current = path[path.length - 1];

      if (!current) {
        continue;
      }

      if (current === toNodeId) {
        return {
          found: true,
          path,
          hops: path.length - 1
        };
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const relations = this.relationsFor(
        current,
        "both"
      );

      for (const relation of relations) {
        const next =
          relation.fromNodeId === current
            ? relation.toNodeId
            : relation.fromNodeId;

        if (!visited.has(next)) {
          queue.push([...path, next]);
        }
      }
    }

    return {
      found: false,
      path: [] as string[],
      hops: 0
    };
  }

  private relationsFor(
    nodeId: string,
    direction: GraphTraversalRequest["direction"]
  ): KnowledgeRelationship[] {
    if (direction === "incoming") {
      return this.relationships.incoming(nodeId);
    }

    if (direction === "outgoing") {
      return this.relationships.outgoing(nodeId);
    }

    const all = [
      ...this.relationships.incoming(nodeId),
      ...this.relationships.outgoing(nodeId)
    ];

    return all.filter(
      (relationship, index) =>
        all.findIndex(
          (candidate) =>
            candidate.id === relationship.id
        ) === index
    );
  }
}
