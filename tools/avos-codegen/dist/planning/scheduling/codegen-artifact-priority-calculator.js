"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenArtifactPriorityCalculator = void 0;
class CodeGenArtifactPriorityCalculator {
    calculate(node) {
        const dependencyBoost = node.dependencies.length *
            10;
        const dependentBoost = node.dependents.length *
            20;
        const depthPenalty = node.depth *
            5;
        return Math.max(0, 100 +
            dependentBoost +
            dependencyBoost -
            depthPenalty);
    }
}
exports.CodeGenArtifactPriorityCalculator = CodeGenArtifactPriorityCalculator;
//# sourceMappingURL=codegen-artifact-priority-calculator.js.map