"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenCriticalPathAnalyzer = void 0;
const codegen_topological_sorter_1 = require("../algorithms/codegen-topological-sorter");
class CodeGenCriticalPathAnalyzer {
    sorter;
    constructor(sorter = new codegen_topological_sorter_1.CodeGenTopologicalSorter()) {
        this.sorter = sorter;
    }
    analyze(graph) {
        const sorted = this.sorter.sort(graph);
        if (!sorted.valid) {
            return {
                artifactKeys: [],
                totalWeight: 0,
                stages: 0,
                generatedAt: new Date().toISOString(),
            };
        }
        const distances = new Map();
        const previous = new Map();
        for (const key of sorted.orderedKeys) {
            const node = graph.getNode(key);
            const base = node.weight;
            if (node.incoming.length === 0) {
                distances.set(key, base);
                continue;
            }
            let bestDependency;
            let bestDistance = -1;
            for (const dependencyKey of node.incoming) {
                const distance = distances.get(dependencyKey) ?? 0;
                if (distance >
                    bestDistance) {
                    bestDistance =
                        distance;
                    bestDependency =
                        dependencyKey;
                }
            }
            distances.set(key, bestDistance +
                base);
            if (bestDependency) {
                previous.set(key, bestDependency);
            }
        }
        const terminal = Array.from(distances.entries())
            .sort((left, right) => right[1] -
            left[1])[0];
        if (!terminal) {
            return {
                artifactKeys: [],
                totalWeight: 0,
                stages: 0,
                generatedAt: new Date().toISOString(),
            };
        }
        const path = [];
        let cursor = terminal[0];
        while (cursor) {
            path.unshift(cursor);
            cursor =
                previous.get(cursor);
        }
        return {
            artifactKeys: path,
            totalWeight: terminal[1],
            stages: path.length,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenCriticalPathAnalyzer = CodeGenCriticalPathAnalyzer;
//# sourceMappingURL=codegen-critical-path-analyzer.js.map