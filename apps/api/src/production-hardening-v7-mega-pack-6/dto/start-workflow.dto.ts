import {
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class StartWorkflowDto {
  @IsString()
  trigger!: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
