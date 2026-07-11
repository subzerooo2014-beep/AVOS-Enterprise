"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGraphDepthAnalyzer = void 0;
class CodeGenGraphDepthAnalyzer {
    analyze(graph) {
        const memo = new Map();
        const active = new Set();
        const depthOf = (key) => {
            const cached = memo.get(key);
            if (cached !== undefined) {
                return cached;
            }
            if (active.has(key)) {
                return 0;
            }
            active.add(key);
            const node = graph.getNode(key);
            const depth = node.incoming.length === 0
                ? 0
                : 1 +
                    Math.max(...node.incoming.map((dependencyKey) => depthOf(dependencyKey)));
            active.delete(key);
            memo.set(key, depth);
            return depth;
        };
        const depths = {};
        for (const node of graph.listNodes()) {
            depths[node.key] =
                depthOf(node.key);
        }
        const values = Object.values(depths);
        const maximumDepth = values.length > 0
            ? Math.max(...values)
            : 0;
        return {
            depths,
            maximumDepth,
            deepestNodes: Object.entries(depths)
                .filter(([, depth]) => depth ===
                maximumDepth)
                .map(([key]) => key)
                .sort(),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenGraphDepthAnalyzer = CodeGenGraphDepthAnalyzer;
//# sourceMappingURL=codegen-graph-depth-analyzer.js.map