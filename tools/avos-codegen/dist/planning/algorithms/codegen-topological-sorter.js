"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTopologicalSorter = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenTopologicalSorter {
    sort(graph) {
        const nodes = graph.listNodes();
        const indegree = new Map();
        for (const node of nodes) {
            indegree.set(node.key, node.indegree);
        }
        let ready = nodes
            .filter((node) => node.indegree === 0)
            .map((node) => node.key)
            .sort();
        const orderedKeys = [];
        const levels = [];
        while (ready.length > 0) {
            const currentLevel = [...ready];
            levels.push(currentLevel);
            orderedKeys.push(...currentLevel);
            const nextReady = [];
            for (const key of currentLevel) {
                const node = graph.getNode(key);
                for (const dependentKey of node.outgoing) {
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
        const unresolved = nodes
            .map((node) => node.key)
            .filter((key) => !orderedKeys.includes(key));
        return {
            valid: unresolved.length === 0,
            orderedKeys,
            levels,
            unresolved,
            generatedAt: new Date().toISOString(),
        };
    }
    requireValid(graph) {
        const result = this.sort(graph);
        if (!result.valid) {
            throw new codegen_errors_1.CodeGenValidationError(`Dependency graph cannot be sorted. Unresolved nodes: ${result.unresolved.join(", ")}`);
        }
        return result;
    }
}
exports.CodeGenTopologicalSorter = CodeGenTopologicalSorter;
//# sourceMappingURL=codegen-topological-sorter.js.map