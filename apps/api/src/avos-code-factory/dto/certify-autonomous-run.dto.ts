import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CertifyAutonomousRunDto {
  @IsString()
  @IsNotEmpty()
  runId!: string;

  @IsBoolean()
  approved!: boolean;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
