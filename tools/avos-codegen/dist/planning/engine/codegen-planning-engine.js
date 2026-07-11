"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPlanningEngine = void 0;
const codegen_planning_registry_1 = require("../registry/codegen-planning-registry");
const codegen_default_planner_1 = require("./codegen-default-planner");
class CodeGenPlanningEngine {
    registry;
    constructor(registry = new codegen_planning_registry_1.CodeGenPlanningRegistry()) {
        this.registry = registry;
        if (this.registry.list()
            .length === 0) {
            this.registry.register(new codegen_default_planner_1.CodeGenDefaultPlanner());
        }
    }
    async execute(plannerKey, context) {
        const planner = this.registry.get(plannerKey);
        return planner.plan(context);
    }
    async executeDefault(context) {
        return this.execute("default-planner", context);
    }
}
exports.CodeGenPlanningEngine = CodeGenPlanningEngine;
//# sourceMappingURL=codegen-planning-engine.js.map