import { IsObject, IsOptional, IsString } from "class-validator";

export class StartRunDto {
  @IsString()
  objective!: string;

  @IsOptional()
  @IsObject()
  input?: Record<string, unknown>;
}