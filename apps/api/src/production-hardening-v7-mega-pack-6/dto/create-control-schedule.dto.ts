import {
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateControlScheduleDto {
  @IsString()
  scheduleCode!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  controlType!: string;

  @IsString()
  handler!: string;

  @IsIn([
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "manual",
  ])
  frequency!:
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "manual";

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  hour?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  minute?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dayOfMonth?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}
