import {
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class AppendEvidenceChainDto {
  @IsString()
  evidenceType!: string;

  @IsString()
  sourceType!: string;

  @IsString()
  sourceId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  createdBy!: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
