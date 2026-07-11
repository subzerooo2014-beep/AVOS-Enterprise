import { IsIn } from "class-validator";

export class UpdateRiskTreatmentStatusDto {
  @IsIn([
    "draft",
    "pending_approval",
    "approved",
    "executing",
    "completed",
    "rejected",
    "cancelled",
  ])
  status!:
    | "draft"
    | "pending_approval"
    | "approved"
    | "executing"
    | "completed"
    | "rejected"
    | "cancelled";
}
