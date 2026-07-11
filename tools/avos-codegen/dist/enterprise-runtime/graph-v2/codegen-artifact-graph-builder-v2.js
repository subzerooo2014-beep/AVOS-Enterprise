"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenArtifactGraphBuilderV2 = void 0;
class CodeGenArtifactGraphBuilderV2 {
    build(artifacts) {
        const byKey = new Map(artifacts.map((artifact) => [
            artifact.key,
            artifact,
        ]));
        const unresolvedDependencies = {};
        const nodes = artifacts.map((artifact) => {
            const unresolved = artifact.dependencies
                .filter((dependencyKey) => !byKey.has(dependencyKey));
            if (unresolved.length >
                0) {
                unresolvedDependencies[artifact.key] =
                    unresolved;
            }
            const dependents = artifacts
                .filter((candidate) => candidate.dependencies.includes(artifact.key))
                .map((candidate) => candidate.key);
            return {
                key: artifact.key,
                artifact: structuredClone(artifact),
                dependencies: [...artifact.dependencies],
                dependents,
                depth: 0,
                root: artifact.dependencies.length ===
                    0,
                leaf: dependents.length ===
                    0,
            };
        });
        const depthMemo = new Map();
        const depthOf = (key, active = new Set()) => {
            const cached = depthMemo.get(key);
            if (cached !== undefined) {
                return cached;
            }
            if (active.has(key)) {
                return 0;
            }
            active.add(key);
            const node = nodes.find((candidate) => candidate.key ===
                key);
            if (!node) {
                return 0;
            }
            const depth = node.dependencies.length ===
                0
                ? 0
                : 1 +
                    Math.max(...node.dependencies.map((dependencyKey) => depthOf(dependencyKey, new Set(active))));
            depthMemo.set(key, depth);
            return depth;
        };
        for (const node of nodes) {
            node.depth =
                depthOf(node.key);
        }
        return {
            nodes,
            roots: nodes
                .filter((node) => node.root)
                .map((node) => node.key),
            leaves: nodes
                .filter((node) => node.leaf)
                .map((node) => node.key),
            unresolvedDependencies,
            cycles: this.detectCycles(nodes),
            generatedAt: new Date().toISOString(),
        };
    }
    detectCycles(nodes) {
        const byKey = new Map(nodes.map((node) => [
            node.key,
            node,
        ]));
        const cycles = [];
        const signatures = new Set();
        const visit = (key, stack, active, visited) => {
            if (active.has(key)) {
                const start = stack.indexOf(key);
                const cycle = [
                    ...stack.slice(start),
                    key,
                ];
                const signature = cycle.join("->");
                if (!signatures.has(signature)) {
                    signatures.add(signature);
                    cycles.push(cycle);
                }
                return;
            }
            if (visited.has(key)) {
                return;
            }
            visited.add(key);
            active.add(key);
            stack.push(key);
            const node = byKey.get(key);
            if (node) {
                for (const dependencyKey of node.dependencies) {
                    if (byKey.has(dependencyKey)) {
                        visit(dependencyKey, stack, active, visited);
                    }
                }
            }
            stack.pop();
            active.delete(key);
        };
        const visited = new Set();
        for (const node of nodes) {
            visit(node.key, [], new Set(), visited);
        }
        return cycles;
    }
}
exports.CodeGenArtifactGraphBuilderV2 = CodeGenArtifactGraphBuilderV2;
//# sourceMappingURL=codegen-artifact-graph-builder-v2.js.map