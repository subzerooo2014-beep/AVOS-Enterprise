import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateRetentionPolicyDto {
  @IsString()
  policyCode!: string;

  @IsString()
  resourceType!: string;

  @IsInt()
  @Min(1)
  retentionDays!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  archiveAfterDays?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  purgeAfterDays?: number;

  @IsOptional()
  @IsBoolean()
  legalHoldSupported?: boolean;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsString()
  description!: string;
}
