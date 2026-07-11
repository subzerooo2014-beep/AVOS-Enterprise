"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDependencyGraph = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_dependency_graph_contracts_1 = require("./codegen-dependency-graph.contracts");
class CodeGenDependencyGraph {
    nodes = new Map();
    edges = new Map();
    addArtifact(artifact, replace = false) {
        const key = artifact.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Dependency graph artifact key is required");
        }
        if (this.nodes.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Dependency graph node already exists: ${key}`);
        }
        const node = {
            key,
            artifact: structuredClone(artifact),
            incoming: [],
            outgoing: [],
            indegree: 0,
            outdegree: 0,
            depth: 0,
            weight: this.resolveArtifactWeight(artifact),
            state: codegen_dependency_graph_contracts_1.CodeGenGraphNodeState.READY,
            metadata: {
                artifactType: artifact.type,
                relativePath: artifact.relativePath,
            },
        };
        this.nodes.set(key, node);
        return structuredClone(node);
    }
    addArtifacts(artifacts, replace = false) {
        const result = [];
        for (const artifact of artifacts) {
            result.push(this.addArtifact(artifact, replace));
        }
        this.rebuildEdges();
        return result;
    }
    getNode(key) {
        const node = this.nodes.get(key);
        if (!node) {
            throw new codegen_errors_1.CodeGenValidationError(`Dependency graph node was not found: ${key}`);
        }
        return structuredClone(node);
    }
    findNode(key) {
        const node = this.nodes.get(key);
        return node
            ? structuredClone(node)
            : undefined;
    }
    listNodes() {
        return Array.from(this.nodes.values())
            .map((node) => structuredClone(node))
            .sort((left, right) => left.key.localeCompare(right.key));
    }
    listEdges() {
        return Array.from(this.edges.values())
            .map((edge) => structuredClone(edge))
            .sort((left, right) => left.id.localeCompare(right.id));
    }
    removeNode(key) {
        const node = this.getNode(key);
        this.nodes.delete(key);
        this.rebuildEdges();
        return node;
    }
    clear() {
        this.nodes.clear();
        this.edges.clear();
    }
    snapshot() {
        const nodes = this.listNodes();
        const edges = this.listEdges();
        return {
            nodes,
            edges,
            roots: nodes
                .filter((node) => node.indegree === 0)
                .map((node) => node.key),
            leaves: nodes
                .filter((node) => node.outdegree === 0)
                .map((node) => node.key),
            isolated: nodes
                .filter((node) => node.indegree === 0 &&
                node.outdegree === 0)
                .map((node) => node.key),
            generatedAt: new Date().toISOString(),
        };
    }
    rebuildEdges() {
        this.edges.clear();
        for (const node of this.nodes.values()) {
            node.incoming = [];
            node.outgoing = [];
            node.indegree = 0;
            node.outdegree = 0;
            node.state =
                codegen_dependency_graph_contracts_1.CodeGenGraphNodeState.READY;
        }
        for (const node of this.nodes.values()) {
            for (const dependencyKey of node.artifact.dependencies) {
                const dependency = this.nodes.get(dependencyKey);
                if (!dependency) {
                    node.state =
                        codegen_dependency_graph_contracts_1.CodeGenGraphNodeState.BLOCKED;
                    continue;
                }
                const edge = {
                    id: (0, node_crypto_1.randomUUID)(),
                    from: dependencyKey,
                    to: node.key,
                    weight: Math.max(1, node.weight),
                    optional: false,
                    metadata: {
                        relationship: "artifact-dependency",
                    },
                };
                this.edges.set(edge.id, edge);
                dependency.outgoing.push(node.key);
                node.incoming.push(dependencyKey);
            }
        }
        for (const node of this.nodes.values()) {
            node.incoming =
                Array.from(new Set(node.incoming)).sort();
            node.outgoing =
                Array.from(new Set(node.outgoing)).sort();
            node.indegree =
                node.incoming.length;
            node.outdegree =
                node.outgoing.length;
        }
    }
    resolveArtifactWeight(artifact) {
        const contentWeight = Math.max(1, Math.ceil(artifact.content.length /
            1000));
        const dependencyWeight = artifact.dependencies.length;
        return contentWeight +
            dependencyWeight;
    }
}
exports.CodeGenDependencyGraph = CodeGenDependencyGraph;
//# sourceMappingURL=codegen-dependency-graph.js.map