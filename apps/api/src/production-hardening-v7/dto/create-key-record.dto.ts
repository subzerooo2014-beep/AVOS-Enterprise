import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateKeyRecordDto {
  @IsString()
  keyAlias!: string;

  @IsString()
  purpose!: string;

  @IsString()
  algorithm!: string;

  @IsString()
  provider!: string;

  @IsOptional()
  @IsIn([
    "planned",
    "active",
    "rotation_due",
    "rotating",
    "retired",
    "revoked",
  ])
  status?:
    | "planned"
    | "active"
    | "rotation_due"
    | "rotating"
    | "retired"
    | "revoked";

  @IsOptional()
  @IsString()
  activatedAt?: string;

  @IsOptional()
  @IsString()
  rotationDueAt?: string;

  @IsOptional()
  @IsString()
  fingerprint?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
