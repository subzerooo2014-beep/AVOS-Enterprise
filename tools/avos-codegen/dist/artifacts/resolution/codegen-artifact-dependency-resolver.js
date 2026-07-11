"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenArtifactDependencyResolver = void 0;
class CodeGenArtifactDependencyResolver {
    resolve(graph) {
        const nodes = graph.list();
        const unresolvedDependencies = nodes.flatMap((node) => node.artifact.dependencies
            .filter((dependencyKey) => !graph.find(dependencyKey))
            .map((dependencyKey) => ({
            artifactKey: node.artifact.key,
            dependencyKey,
        })));
        const circularDependencies = this.findCycles(graph);
        if (unresolvedDependencies.length >
            0 ||
            circularDependencies.length > 0) {
            return {
                orderedArtifacts: [],
                levels: [],
                unresolvedDependencies,
                circularDependencies,
                valid: false,
                generatedAt: new Date().toISOString(),
            };
        }
        const indegree = new Map();
        const dependents = new Map();
        for (const node of nodes) {
            indegree.set(node.artifact.key, node.artifact.dependencies
                .length);
            for (const dependencyKey of node.artifact.dependencies) {
                const list = dependents.get(dependencyKey) ?? [];
                list.push(node.artifact.key);
                dependents.set(dependencyKey, list);
            }
        }
        let ready = Array.from(indegree.entries())
            .filter(([, count]) => count === 0)
            .map(([key]) => key)
            .sort();
        const levels = [];
        const orderedKeys = [];
        while (ready.length > 0) {
            const level = [...ready];
            levels.push(level);
            orderedKeys.push(...level);
            const nextReady = [];
            for (const key of level) {
                for (const dependentKey of dependents.get(key) ?? []) {
                    const next = (indegree.get(dependentKey) ?? 0) - 1;
                    indegree.set(dependentKey, next);
                    if (next === 0) {
                        nextReady.push(dependentKey);
                    }
                }
            }
            ready =
                Array.from(new Set(nextReady)).sort();
        }
        return {
            orderedArtifacts: orderedKeys.map((key) => graph.get(key)
                .artifact),
            levels,
            unresolvedDependencies,
            circularDependencies,
            valid: orderedKeys.length ===
                nodes.length,
            generatedAt: new Date().toISOString(),
        };
    }
    findCycles(graph) {
        const cycles = [];
        const visited = new Set();
        const active = new Set();
        const stack = [];
        const visit = (key) => {
            if (active.has(key)) {
                const index = stack.indexOf(key);
                cycles.push([
                    ...stack.slice(index),
                    key,
                ]);
                return;
            }
            if (visited.has(key)) {
                return;
            }
            visited.add(key);
            active.add(key);
            stack.push(key);
            const node = graph.find(key);
            if (node) {
                for (const dependencyKey of node.artifact.dependencies) {
                    if (graph.find(dependencyKey)) {
                        visit(dependencyKey);
                    }
                }
            }
            stack.pop();
            active.delete(key);
        };
        for (const node of graph.list()) {
            visit(node.artifact.key);
        }
        return cycles;
    }
}
exports.CodeGenArtifactDependencyResolver = CodeGenArtifactDependencyResolver;
//# sourceMappingURL=codegen-artifact-dependency-resolver.js.map