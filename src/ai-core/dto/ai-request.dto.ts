import { IsOptional, IsString } from "class-validator";

export class AiRequestDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  task?: string;
}
