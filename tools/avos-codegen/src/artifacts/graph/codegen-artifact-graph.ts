import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactGraphSnapshot,
  CodeGenArtifactNode,
  CodeGenArtifactStatus,
} from "../codegen-artifact.contracts";

export class CodeGenArtifactGraph {
  private readonly nodes =
    new Map<string, CodeGenArtifactNode>();

  add(
    artifact: CodeGenArtifactDescriptor,
    replace = false,
  ): CodeGenArtifactNode {
    const key = artifact.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Artifact key is required",
      );
    }

    if (
      this.nodes.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Artifact already exists: ${key}`,
      );
    }

    if (
      artifact.dependencies.includes(key)
    ) {
      throw new CodeGenValidationError(
        `Artifact cannot depend on itself: ${key}`,
      );
    }

    const now =
      new Date().toISOString();

    const node: CodeGenArtifactNode = {
      artifact: {
        ...structuredClone(artifact),
        key,
        dependencies: Array.from(
          new Set(
            artifact.dependencies,
          ),
        ),
        tags: Array.from(
          new Set(
            artifact.tags,
          ),
        ),
      },
      status:
        CodeGenArtifactStatus.PLANNED,
      blockedBy: [],
      dependents: [],
      createdAt: now,
      updatedAt: now,
    };

    this.nodes.set(key, node);
    this.rebuildRelationships();

    return structuredClone(
      this.requireNode(key),
    );
  }

  addMany(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
    replace = false,
  ): CodeGenArtifactNode[] {
    const added: CodeGenArtifactNode[] = [];

    for (const artifact of artifacts) {
      added.push(
        this.add(
          artifact,
          replace,
        ),
      );
    }

    return added;
  }

  get(
    key: string,
  ): CodeGenArtifactNode {
    return structuredClone(
      this.requireNode(key),
    );
  }

  find(
    key: string,
  ): CodeGenArtifactNode | undefined {
    const node = this.nodes.get(key);

    return node
      ? structuredClone(node)
      : undefined;
  }

  list():
    CodeGenArtifactNode[] {
    return Array.from(
      this.nodes.values(),
    )
      .map((node) =>
        structuredClone(node),
      )
      .sort((left, right) =>
        left.artifact.key.localeCompare(
          right.artifact.key,
        ),
      );
  }

  updateStatus(
    key: string,
    status: CodeGenArtifactStatus,
    blockedBy: string[] = [],
  ): CodeGenArtifactNode {
    const node =
      this.requireNode(key);

    node.status = status;
    node.blockedBy =
      Array.from(
        new Set(blockedBy),
      );
    node.updatedAt =
      new Date().toISOString();

    return structuredClone(node);
  }

  remove(
    key: string,
  ): CodeGenArtifactNode {
    const node =
      this.requireNode(key);

    this.nodes.delete(key);
    this.rebuildRelationships();

    return structuredClone(node);
  }

  clear(): void {
    this.nodes.clear();
  }

  snapshot():
    CodeGenArtifactGraphSnapshot {
    const nodes = this.list();

    const edges =
      nodes.reduce(
        (total, node) =>
          total +
          node.artifact
            .dependencies.length,
        0,
      );

    return {
      artifacts:
        nodes.length,
      edges,
      roots:
        nodes
          .filter(
            (node) =>
              node.artifact
                .dependencies.length ===
              0,
          )
          .map(
            (node) =>
              node.artifact.key,
          ),
      leaves:
        nodes
          .filter(
            (node) =>
              node.dependents.length ===
              0,
          )
          .map(
            (node) =>
              node.artifact.key,
          ),
      blocked:
        nodes
          .filter(
            (node) =>
              node.status ===
              CodeGenArtifactStatus.BLOCKED,
          )
          .map(
            (node) =>
              node.artifact.key,
          ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private rebuildRelationships():
    void {
    for (const node of this.nodes.values()) {
      node.dependents = [];
      node.blockedBy =
        node.artifact.dependencies
          .filter(
            (dependencyKey) =>
              !this.nodes.has(
                dependencyKey,
              ),
          );
      node.status =
        node.blockedBy.length > 0
          ? CodeGenArtifactStatus.BLOCKED
          : node.status ===
              CodeGenArtifactStatus.BLOCKED
            ? CodeGenArtifactStatus.PLANNED
            : node.status;
      node.updatedAt =
        new Date().toISOString();
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

        if (dependency) {
          dependency.dependents.push(
            node.artifact.key,
          );
        }
      }
    }

    for (const node of this.nodes.values()) {
      node.dependents =
        Array.from(
          new Set(
            node.dependents,
          ),
        ).sort();
    }
  }

  private requireNode(
    key: string,
  ): CodeGenArtifactNode {
    const node = this.nodes.get(key);

    if (!node) {
      throw new CodeGenValidationError(
        `Artifact was not found: ${key}`,
      );
    }

    return node;
  }
}
