import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateVersionedPolicyDto {
  @IsString()
  @MaxLength(150)
  id!: string;

  @IsString()
  @MaxLength(250)
  name!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  methods!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  pathPrefixes!: string[];

  @IsBoolean()
  requireApprovalToken!: boolean;

  @IsBoolean()
  blockInProduction!: boolean;

  @IsString()
  @IsIn(["info", "warning", "error", "critical"])
  severity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  changeReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  changedBy?: string;
}
