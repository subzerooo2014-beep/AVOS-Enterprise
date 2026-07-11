import { IsIn, IsOptional, IsString } from "class-validator";

export class RunAssuranceDto {
  @IsOptional()
  @IsString()
  @IsIn(["manual", "scheduled", "deployment", "incident", "api"])
  trigger?: "manual" | "scheduled" | "deployment" | "incident" | "api";
}
