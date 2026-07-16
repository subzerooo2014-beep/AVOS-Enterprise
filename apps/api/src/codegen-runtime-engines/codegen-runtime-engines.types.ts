export type CodegenRuntimeEnginesCapability =
  | "TEMPLATE_COMPILER"
  | "TEMPLATE_RUNTIME"
  | "VARIABLE_SCHEMA_ENGINE"
  | "BLUEPRINT_DEPENDENCY_GRAPH"
  | "CAPABILITY_RESOLVER"
  | "CONFLICT_RESOLUTION_ENGINE"
  | "OUTPUT_SAFETY_ENGINE"
  | "VALIDATION_RUNTIME"
  | "END_TO_END_VALIDATION_PIPELINE"
  | "CODEGEN_EVIDENCE";

export interface CodegenRuntimeEnginesRecord {
  id: string;
  capability: CodegenRuntimeEnginesCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}