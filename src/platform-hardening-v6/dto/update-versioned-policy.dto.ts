import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdateVersionedPolicyDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  methods?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pathPrefixes?: string[];

  @IsOptional()
  @IsBoolean()
  requireApprovalToken?: boolean;

  @IsOptional()
  @IsBoolean()
  blockInProduction?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["info", "warning", "error", "critical"])
  severity?: string;

  @IsString()
  @MaxLength(1000)
  changeReason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  changedBy?: string;
}
