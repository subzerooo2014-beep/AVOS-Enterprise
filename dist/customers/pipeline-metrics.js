"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineMetrics = void 0;
class PipelineMetrics {
    conversion(leads, wins) {
        return leads === 0 ? 0 : (wins / leads) * 100;
    }
}
exports.PipelineMetrics = PipelineMetrics;
//# sourceMappingURL=pipeline-metrics.js.map