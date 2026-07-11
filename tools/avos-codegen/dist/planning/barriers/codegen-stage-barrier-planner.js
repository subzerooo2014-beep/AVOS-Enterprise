"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenStageBarrierPlanner = void 0;
class CodeGenStageBarrierPlanner {
    plan(executionPlan, maxParallel) {
        return executionPlan.stages.map((stage, index) => ({
            index: stage.index,
            artifactKeys: [...stage.artifactKeys],
            barrierBefore: index > 0,
            barrierAfter: index <
                executionPlan.stages.length -
                    1,
            concurrency: Math.max(1, Math.min(maxParallel, stage.artifactKeys.length)),
            estimatedWeight: stage.artifactKeys.length,
        }));
    }
}
exports.CodeGenStageBarrierPlanner = CodeGenStageBarrierPlanner;
//# sourceMappingURL=codegen-stage-barrier-planner.js.map