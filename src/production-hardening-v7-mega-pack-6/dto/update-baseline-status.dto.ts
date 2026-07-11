import { IsIn } from "class-validator";

export class UpdateBaselineStatusDto {
  @IsIn([
    "draft",
    "pending_approval",
    "approved",
    "active",
    "superseded",
    "retired",
  ])
  status!:
    | "draft"
    | "pending_approval"
    | "approved"
    | "active"
    | "superseded"
    | "retired";
}
