"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPriorityWeightDispatchStrategy = void 0;
class CodeGenPriorityWeightDispatchStrategy {
    sort(tasks) {
        return [...tasks]
            .sort((left, right) => right.priority -
            left.priority ||
            right.weight -
                left.weight ||
            left.createdAt.localeCompare(right.createdAt));
    }
}
exports.CodeGenPriorityWeightDispatchStrategy = CodeGenPriorityWeightDispatchStrategy;
//# sourceMappingURL=codegen-task-dispatch-strategy.js.map