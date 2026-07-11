"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeGenEnterpriseRuntimeV2 = createCodeGenEnterpriseRuntimeV2;
const codegen_enterprise_runtime_orchestrator_1 = require("../orchestration/codegen-enterprise-runtime-orchestrator");
const codegen_generation_cache_v2_1 = require("../cache/codegen-generation-cache-v2");
const codegen_enterprise_session_manager_v2_1 = require("../sessions/codegen-enterprise-session-manager-v2");
const codegen_enterprise_build_coordinator_v2_1 = require("../coordinator/codegen-enterprise-build-coordinator-v2");
function createCodeGenEnterpriseRuntimeV2() {
    return {
        sessions: new codegen_enterprise_session_manager_v2_1.CodeGenEnterpriseSessionManagerV2(),
        cache: new codegen_generation_cache_v2_1.CodeGenGenerationCacheV2(),
        build: new codegen_enterprise_build_coordinator_v2_1.CodeGenEnterpriseBuildCoordinatorV2(),
        orchestrator: new codegen_enterprise_runtime_orchestrator_1.CodeGenEnterpriseRuntimeOrchestrator(),
    };
}
//# sourceMappingURL=codegen-enterprise-runtime-v2.js.map