export interface InspectionWorkflowInput {
  vehicleId: string;
  inspectionScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  criticalIssues: number;
}

export interface InspectionWorkflowResult {
  status: "PASSED" | "FAILED" | "ESCALATED" | "IN_PROGRESS";
  actions: string[];
}
