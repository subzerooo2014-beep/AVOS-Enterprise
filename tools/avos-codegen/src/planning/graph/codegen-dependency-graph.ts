import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenDependencyGraphEdge,
  CodeGenDependencyGraphNode,
  CodeGenDependencyGraphSnapshot,
  CodeGenGraphNodeState,
} from "./codegen-dependency-graph.contracts";

export class CodeGenDependencyGraph {
  private readonly nodes =
    new Map<string, CodeGenDependencyGraphNode>();

  private readonly edges =
    new Map<string, CodeGenDependencyGraphEdge>();

  addArtifact(
    artifact: CodeGenArtifactDescriptor,
    replace = false,
  ): CodeGenDependencyGraphNode {
    const key =
      artifact.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Dependency graph artifact key is required",
      );
    }

    if (
      this.nodes.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Dependency graph node already exists: ${key}`,
      );
    }

    const node:
      CodeGenDependencyGraphNode = {
      key,
      artifact:
        structuredClone(
          artifact,
        ),
      incoming: [],
      outgoing: [],
      indegree: 0,
      outdegree: 0,
      depth: 0,
      weight:
        this.resolveArtifactWeight(
          artifact,
        ),
      state:
        CodeGenGraphNodeState.READY,
      metadata: {
        artifactType:
          artifact.type,
        relativePath:
          artifact.relativePath,
      },
    };

    this.nodes.set(key, node);

    return structuredClone(node);
  }

  addArtifacts(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
    replace = false,
  ): CodeGenDependencyGraphNode[] {
    const result: CodeGenDependencyGraphNode[] = [];

    for (const artifact of artifacts) {
      result.push(
        this.addArtifact(
          artifact,
          replace,
        ),
      );
    }

    this.rebuildEdges();

    return result;
  }

  getNode(
    key: string,
  ): CodeGenDependencyGraphNode {
    const node =
      this.nodes.get(key);

    if (!node) {
      throw new CodeGenValidationError(
        `Dependency graph node was not found: ${key}`,
      );
    }

    return structuredClone(node);
  }

  findNode(
    key: string,
  ): CodeGenDependencyGraphNode | undefined {
    const node =
      this.nodes.get(key);

    return node
      ? structuredClone(node)
      : undefined;
  }

  listNodes():
    CodeGenDependencyGraphNode[] {
    return Array.from(
      this.nodes.values(),
    )
      .map((node) =>
        structuredClone(node),
      )
      .sort(
        (left, right) =>
          left.key.localeCompare(
            right.key,
          ),
      );
  }

  listEdges():
    CodeGenDependencyGraphEdge[] {
    return Array.from(
      this.edges.values(),
    )
      .map((edge) =>
        structuredClone(edge),
      )
      .sort(
        (left, right) =>
          left.id.localeCompare(
            right.id,
          ),
      );
  }

  removeNode(
    key: string,
  ): CodeGenDependencyGraphNode {
    const node =
      this.getNode(key);

    this.nodes.delete(key);
    this.rebuildEdges();

    return node;
  }

  clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }

  snapshot():
    CodeGenDependencyGraphSnapshot {
    const nodes =
      this.listNodes();

    const edges =
      this.listEdges();

    return {
      nodes,
      edges,
      roots:
        nodes
          .filter(
            (node) =>
              node.indegree === 0,
          )
          .map(
            (node) =>
              node.key,
          ),
      leaves:
        nodes
          .filter(
            (node) =>
              node.outdegree === 0,
          )
          .map(
            (node) =>
              node.key,
          ),
      isolated:
        nodes
          .filter(
            (node) =>
              node.indegree === 0 &&
              node.outdegree === 0,
          )
          .map(
            (node) =>
              node.key,
          ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private rebuildEdges():
    void {
    this.edges.clear();

    for (const node of this.nodes.values()) {
      node.incoming = [];
      node.outgoing = [];
      node.indegree = 0;
      node.outdegree = 0;
      node.state =
        CodeGenGraphNodeState.READY;
    }

    for (const node of this.nodes.values()) {
      for (
        const dependencyKey of
        node.artifact.dependencies
      ) {
        const dependency =
          this.nodes.get(
            dependencyKey,
          );

        if (!dependency) {
          node.state =
            CodeGenGraphNodeState.BLOCKED;
          continue;
        }

        const edge:
          CodeGenDependencyGraphEdge = {
          id:
            randomUUID(),
          from:
            dependencyKey,
          to:
            node.key,
          weight:
            Math.max(
              1,
              node.weight,
            ),
          optional: false,
          metadata: {
            relationship:
              "artifact-dependency",
          },
        };

        this.edges.set(
          edge.id,
          edge,
        );

        dependency.outgoing.push(
          node.key,
        );

        node.incoming.push(
          dependencyKey,
        );
      }
    }

    for (const node of this.nodes.values()) {
      node.incoming =
        Array.from(
          new Set(node.incoming),
        ).sort();

      node.outgoing =
        Array.from(
          new Set(node.outgoing),
        ).sort();

      node.indegree =
        node.incoming.length;

      node.outdegree =
        node.outgoing.length;
    }
  }

  private resolveArtifactWeight(
    artifact: CodeGenArtifactDescriptor,
  ): number {
    const contentWeight =
      Math.max(
        1,
        Math.ceil(
          artifact.content.length /
          1000,
        ),
      );

    const dependencyWeight =
      artifact.dependencies.length;

    return contentWeight +
      dependencyWeight;
  }
}
