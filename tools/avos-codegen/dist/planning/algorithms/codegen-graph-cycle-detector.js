"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGraphCycleDetector = void 0;
class CodeGenGraphCycleDetector {
    detect(graph) {
        const nodes = graph.listNodes();
        const visited = new Set();
        const active = new Set();
        const stack = [];
        const cycles = [];
        const signatures = new Set();
        const visit = (key) => {
            if (active.has(key)) {
                const index = stack.indexOf(key);
                const path = [
                    ...stack.slice(index),
                    key,
                ];
                const signature = this.normalizeCycle(path);
                if (!signatures.has(signature)) {
                    signatures.add(signature);
                    cycles.push({
                        path,
                        signature,
                    });
                }
                return;
            }
            if (visited.has(key)) {
                return;
            }
            visited.add(key);
            active.add(key);
            stack.push(key);
            const node = graph.findNode(key);
            if (node) {
                for (const dependencyKey of node.incoming) {
                    visit(dependencyKey);
                }
            }
            stack.pop();
            active.delete(key);
        };
        for (const node of nodes) {
            visit(node.key);
        }
        return cycles;
    }
    normalizeCycle(path) {
        const cycle = path.slice(0, -1);
        if (cycle.length === 0) {
            return "";
        }
        const variants = cycle.map((_, index) => [
            ...cycle.slice(index),
            ...cycle.slice(0, index),
        ].join("->"));
        return variants.sort()[0] ?? "";
    }
}
exports.CodeGenGraphCycleDetector = CodeGenGraphCycleDetector;
//# sourceMappingURL=codegen-graph-cycle-detector.js.map