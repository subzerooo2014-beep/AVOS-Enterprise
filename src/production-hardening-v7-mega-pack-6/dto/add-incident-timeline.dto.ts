import {
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class AddIncidentTimelineDto {
  @IsString()
  eventType!: string;

  @IsString()
  description!: string;

  @IsString()
  actor!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
