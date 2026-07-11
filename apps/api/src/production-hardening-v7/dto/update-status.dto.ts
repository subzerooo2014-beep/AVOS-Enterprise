import { IsIn } from "class-validator";

export class UpdateDriftStatusDto {
  @IsIn(["open", "acknowledged", "resolved", "ignored"])
  status!: "open" | "acknowledged" | "resolved" | "ignored";
}

export class UpdateRiskStatusDto {
  @IsIn([
    "identified",
    "assessed",
    "mitigating",
    "accepted",
    "transferred",
    "closed",
  ])
  status!:
    | "identified"
    | "assessed"
    | "mitigating"
    | "accepted"
    | "transferred"
    | "closed";
}

export class UpdateRemediationStatusDto {
  @IsIn(["open", "in_progress", "blocked", "completed", "cancelled"])
  status!:
    | "open"
    | "in_progress"
    | "blocked"
    | "completed"
    | "cancelled";
}
