"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenArtifactGraph = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_artifact_contracts_1 = require("../codegen-artifact.contracts");
class CodeGenArtifactGraph {
    nodes = new Map();
    add(artifact, replace = false) {
        const key = artifact.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Artifact key is required");
        }
        if (this.nodes.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Artifact already exists: ${key}`);
        }
        if (artifact.dependencies.includes(key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Artifact cannot depend on itself: ${key}`);
        }
        const now = new Date().toISOString();
        const node = {
            artifact: {
                ...structuredClone(artifact),
                key,
                dependencies: Array.from(new Set(artifact.dependencies)),
                tags: Array.from(new Set(artifact.tags)),
            },
            status: codegen_artifact_contracts_1.CodeGenArtifactStatus.PLANNED,
            blockedBy: [],
            dependents: [],
            createdAt: now,
            updatedAt: now,
        };
        this.nodes.set(key, node);
        this.rebuildRelationships();
        return structuredClone(this.requireNode(key));
    }
    addMany(artifacts, replace = false) {
        const added = [];
        for (const artifact of artifacts) {
            added.push(this.add(artifact, replace));
        }
        return added;
    }
    get(key) {
        return structuredClone(this.requireNode(key));
    }
    find(key) {
        const node = this.nodes.get(key);
        return node
            ? structuredClone(node)
            : undefined;
    }
    list() {
        return Array.from(this.nodes.values())
            .map((node) => structuredClone(node))
            .sort((left, right) => left.artifact.key.localeCompare(right.artifact.key));
    }
    updateStatus(key, status, blockedBy = []) {
        const node = this.requireNode(key);
        node.status = status;
        node.blockedBy =
            Array.from(new Set(blockedBy));
        node.updatedAt =
            new Date().toISOString();
        return structuredClone(node);
    }
    remove(key) {
        const node = this.requireNode(key);
        this.nodes.delete(key);
        this.rebuildRelationships();
        return structuredClone(node);
    }
    clear() {
        this.nodes.clear();
    }
    snapshot() {
        const nodes = this.list();
        const edges = nodes.reduce((total, node) => total +
            node.artifact
                .dependencies.length, 0);
        return {
            artifacts: nodes.length,
            edges,
            roots: nodes
                .filter((node) => node.artifact
                .dependencies.length ===
                0)
                .map((node) => node.artifact.key),
            leaves: nodes
                .filter((node) => node.dependents.length ===
                0)
                .map((node) => node.artifact.key),
            blocked: nodes
                .filter((node) => node.status ===
                codegen_artifact_contracts_1.CodeGenArtifactStatus.BLOCKED)
                .map((node) => node.artifact.key),
            generatedAt: new Date().toISOString(),
        };
    }
    rebuildRelationships() {
        for (const node of this.nodes.values()) {
            node.dependents = [];
            node.blockedBy =
                node.artifact.dependencies
                    .filter((dependencyKey) => !this.nodes.has(dependencyKey));
            node.status =
                node.blockedBy.length > 0
                    ? codegen_artifact_contracts_1.CodeGenArtifactStatus.BLOCKED
                    : node.status ===
                        codegen_artifact_contracts_1.CodeGenArtifactStatus.BLOCKED
                        ? codegen_artifact_contracts_1.CodeGenArtifactStatus.PLANNED
                        : node.status;
            node.updatedAt =
                new Date().toISOString();
        }
        for (const node of this.nodes.values()) {
            for (const dependencyKey of node.artifact.dependencies) {
                const dependency = this.nodes.get(dependencyKey);
                if (dependency) {
                    dependency.dependents.push(node.artifact.key);
                }
            }
        }
        for (const node of this.nodes.values()) {
            node.dependents =
                Array.from(new Set(node.dependents)).sort();
        }
    }
    requireNode(key) {
        const node = this.nodes.get(key);
        if (!node) {
            throw new codegen_errors_1.CodeGenValidationError(`Artifact was not found: ${key}`);
        }
        return node;
    }
}
exports.CodeGenArtifactGraph = CodeGenArtifactGraph;
//# sourceMappingURL=codegen-artifact-graph.js.map