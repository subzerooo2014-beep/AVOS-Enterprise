import {
  IsIn,
  IsObject,
  IsOptional,
} from "class-validator";

export class UpdateOperationalStatusDto {
  @IsIn([
    "planned",
    "pending",
    "active",
    "paused",
    "blocked",
    "completed",
    "cancelled",
    "failed",
  ])
  status!:
    | "planned"
    | "pending"
    | "active"
    | "paused"
    | "blocked"
    | "completed"
    | "cancelled"
    | "failed";

  @IsOptional()
  @IsObject()
  output?: Record<string, unknown>;
}
