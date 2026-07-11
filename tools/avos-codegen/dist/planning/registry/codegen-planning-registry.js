"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPlanningRegistry = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenPlanningRegistry {
    planners = new Map();
    register(planner, replace = false) {
        const key = planner.descriptor.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Planner key is required");
        }
        if (this.planners.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Planner already exists: ${key}`);
        }
        this.planners.set(key, planner);
        return planner;
    }
    get(key) {
        const planner = this.planners.get(key);
        if (!planner) {
            throw new codegen_errors_1.CodeGenValidationError(`Planner was not found: ${key}`);
        }
        return planner;
    }
    list() {
        return Array.from(this.planners.values())
            .filter((planner) => planner.descriptor.enabled)
            .sort((left, right) => left.descriptor.priority -
            right.descriptor.priority);
    }
    remove(key) {
        const planner = this.get(key);
        this.planners.delete(key);
        return planner;
    }
    clear() {
        this.planners.clear();
    }
}
exports.CodeGenPlanningRegistry = CodeGenPlanningRegistry;
//# sourceMappingURL=codegen-planning-registry.js.map