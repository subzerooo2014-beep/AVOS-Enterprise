import { IsOptional, IsString } from "class-validator";

export class LeadScoreDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  interest?: string;
}
