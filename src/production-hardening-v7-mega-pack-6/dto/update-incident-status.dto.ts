import { IsIn } from "class-validator";

export class UpdateIncidentStatusDto {
  @IsIn([
    "detected",
    "triaged",
    "declared",
    "contained",
    "recovering",
    "resolved",
    "closed",
  ])
  status!:
    | "detected"
    | "triaged"
    | "declared"
    | "contained"
    | "recovering"
    | "resolved"
    | "closed";
}
