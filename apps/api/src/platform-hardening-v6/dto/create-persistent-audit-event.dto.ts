import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreatePersistentAuditEventDto {
  @IsString()
  @MaxLength(100)
  eventType!: string;

  @IsString()
  @MaxLength(50)
  severity!: string;

  @IsString()
  @MaxLength(200)
  action!: string;

  @IsString()
  @MaxLength(5000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  actor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  correlationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  traceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  method?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  path?: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  statusCode?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
