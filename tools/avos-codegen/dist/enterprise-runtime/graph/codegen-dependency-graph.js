"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDependencyGraph = void 0;
class CodeGenDependencyGraph {
    build(nodes) {
        return new Map(nodes.map(n => [n.id, n]));
    }
    topological(nodes) {
        return [...nodes].sort((a, b) => a.priority - b.priority);
    }
}
exports.CodeGenDependencyGraph = CodeGenDependencyGraph;
//# sourceMappingURL=codegen-dependency-graph.js.map