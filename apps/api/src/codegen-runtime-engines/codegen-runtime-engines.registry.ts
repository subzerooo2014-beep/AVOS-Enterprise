import { CodegenRuntimeEnginesCapability } from "./codegen-runtime-engines.types";

export const CODEGEN_RUNTIME_ENGINES_CAPABILITIES: Readonly<Record<CodegenRuntimeEnginesCapability, string>> = {
  TEMPLATE_COMPILER: "Template Compiler",
  TEMPLATE_RUNTIME: "Template Runtime",
  VARIABLE_SCHEMA_ENGINE: "Variable Schema Engine",
  BLUEPRINT_DEPENDENCY_GRAPH: "Blueprint Dependency Graph",
  CAPABILITY_RESOLVER: "Capability Resolver",
  CONFLICT_RESOLUTION_ENGINE: "Conflict Resolution Engine",
  OUTPUT_SAFETY_ENGINE: "Output Safety Engine",
  VALIDATION_RUNTIME: "Validation Runtime",
  END_TO_END_VALIDATION_PIPELINE: "End To End Validation Pipeline",
  CODEGEN_EVIDENCE: "Codegen Evidence",
};