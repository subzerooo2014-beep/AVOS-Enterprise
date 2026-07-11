"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeGenEnterpriseRuntime = createCodeGenEnterpriseRuntime;
const codegen_enterprise_build_coordinator_v2_1 = require("../coordinator/codegen-enterprise-build-coordinator-v2");
const codegen_generation_cache_v2_1 = require("../cache/codegen-generation-cache-v2");
const codegen_enterprise_session_manager_v2_1 = require("../sessions/codegen-enterprise-session-manager-v2");
function createCodeGenEnterpriseRuntime() {
    return {
        sessions: new codegen_enterprise_session_manager_v2_1.CodeGenEnterpriseSessionManagerV2(),
        cache: new codegen_generation_cache_v2_1.CodeGenGenerationCacheV2(),
        coordinator: new codegen_enterprise_build_coordinator_v2_1.CodeGenEnterpriseBuildCoordinatorV2(),
    };
}
//# sourceMappingURL=codegen-enterprise-runtime-bootstrap.js.map