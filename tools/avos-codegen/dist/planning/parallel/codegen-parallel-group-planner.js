"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenParallelGroupPlanner = void 0;
class CodeGenParallelGroupPlanner {
    plan(executionPlan, maxParallel) {
        const groups = [];
        for (const stage of executionPlan.stages) {
            const nodes = stage.artifactKeys
                .map((key) => executionPlan.nodes.find((node) => node.key === key))
                .filter((node) => Boolean(node))
                .sort((left, right) => right.artifact.content.length -
                left.artifact.content.length);
            const buckets = Array.from({
                length: Math.max(1, Math.min(maxParallel, nodes.length)),
            }, () => ({
                keys: [],
                weight: 0,
            }));
            for (const node of nodes) {
                const bucket = buckets
                    .slice()
                    .sort((left, right) => left.weight -
                    right.weight)[0];
                bucket.keys.push(node.key);
                bucket.weight +=
                    Math.max(1, Math.ceil(node.artifact.content.length /
                        1000));
            }
            buckets.forEach((bucket, groupIndex) => {
                if (bucket.keys.length >
                    0) {
                    groups.push({
                        stageIndex: stage.index,
                        groupIndex,
                        artifactKeys: bucket.keys,
                        totalWeight: bucket.weight,
                    });
                }
            });
        }
        return groups;
    }
}
exports.CodeGenParallelGroupPlanner = CodeGenParallelGroupPlanner;
//# sourceMappingURL=codegen-parallel-group-planner.js.map