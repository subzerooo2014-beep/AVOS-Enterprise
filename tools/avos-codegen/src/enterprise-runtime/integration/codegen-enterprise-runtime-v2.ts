import {
  CodeGenEnterpriseRuntimeOrchestrator,
} from "../orchestration/codegen-enterprise-runtime-orchestrator";
import {
  CodeGenGenerationCacheV2,
} from "../cache/codegen-generation-cache-v2";
import {
  CodeGenEnterpriseSessionManagerV2,
} from "../sessions/codegen-enterprise-session-manager-v2";
import {
  CodeGenEnterpriseBuildCoordinatorV2,
} from "../coordinator/codegen-enterprise-build-coordinator-v2";

export interface CodeGenEnterpriseRuntimeV2 {
  sessions:
    CodeGenEnterpriseSessionManagerV2;
  cache:
    CodeGenGenerationCacheV2;
  build:
    CodeGenEnterpriseBuildCoordinatorV2;
  orchestrator:
    CodeGenEnterpriseRuntimeOrchestrator;
}

export function createCodeGenEnterpriseRuntimeV2():
  CodeGenEnterpriseRuntimeV2 {
  return {
    sessions:
      new CodeGenEnterpriseSessionManagerV2(),
    cache:
      new CodeGenGenerationCacheV2(),
    build:
      new CodeGenEnterpriseBuildCoordinatorV2(),
    orchestrator:
      new CodeGenEnterpriseRuntimeOrchestrator(),
  };
}
