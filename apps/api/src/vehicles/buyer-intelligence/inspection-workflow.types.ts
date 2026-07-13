export type InspectionWorkflowStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "PASSED"
  | "FAILED"
  | "ESCALATED";

export interface InspectionWorkflowInput {
  inspectionId: string;
  vehicleId: string;
  inspectionScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  criticalIssues: number;
}

export interface InspectionWorkflowResult {
  inspectionId: string;
  status: InspectionWorkflowStatus;
  actions: string[];
}
