import { CodeGenEnterpriseRuntimeOrchestrator } from "../orchestration/codegen-enterprise-runtime-orchestrator";
import { CodeGenGenerationCacheV2 } from "../cache/codegen-generation-cache-v2";
import { CodeGenEnterpriseSessionManagerV2 } from "../sessions/codegen-enterprise-session-manager-v2";
import { CodeGenEnterpriseBuildCoordinatorV2 } from "../coordinator/codegen-enterprise-build-coordinator-v2";
export interface CodeGenEnterpriseRuntimeV2 {
    sessions: CodeGenEnterpriseSessionManagerV2;
    cache: CodeGenGenerationCacheV2;
    build: CodeGenEnterpriseBuildCoordinatorV2;
    orchestrator: CodeGenEnterpriseRuntimeOrchestrator;
}
export declare function createCodeGenEnterpriseRuntimeV2(): CodeGenEnterpriseRuntimeV2;
//# sourceMappingURL=codegen-enterprise-runtime-v2.d.ts.map