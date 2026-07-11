import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateApprovalRequestDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  requestType!: string;

  @IsString()
  requestedBy!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  requiredApprovers!: string[];

  @IsInt()
  @Min(1)
  @Max(100)
  minimumApprovals!: number;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsString()
  entityType!: string;

  @IsString()
  entityId!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
