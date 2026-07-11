import {
  CodeGenEnterpriseBuildCoordinatorV2,
} from "../coordinator/codegen-enterprise-build-coordinator-v2";
import {
  CodeGenGenerationCacheV2,
} from "../cache/codegen-generation-cache-v2";
import {
  CodeGenEnterpriseSessionManagerV2,
} from "../sessions/codegen-enterprise-session-manager-v2";

export interface CodeGenEnterpriseRuntimeBootstrap {
  sessions:
    CodeGenEnterpriseSessionManagerV2;
  cache:
    CodeGenGenerationCacheV2;
  coordinator:
    CodeGenEnterpriseBuildCoordinatorV2;
}

export function createCodeGenEnterpriseRuntime():
  CodeGenEnterpriseRuntimeBootstrap {
  return {
    sessions:
      new CodeGenEnterpriseSessionManagerV2(),
    cache:
      new CodeGenGenerationCacheV2(),
    coordinator:
      new CodeGenEnterpriseBuildCoordinatorV2(),
  };
}
