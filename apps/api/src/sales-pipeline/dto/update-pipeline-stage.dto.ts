import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePipelineStageDto {
  @IsString()
  id!: string;

  @IsString()
  stage!: string;

  @IsOptional()
  @IsNumber()
  value?: number;
}
