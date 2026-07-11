import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateIncidentActionDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  owner!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  priority!: number;

  @IsOptional()
  @IsString()
  dueAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidenceReferences?: string[];
}
