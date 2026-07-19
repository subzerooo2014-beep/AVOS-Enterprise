import { IsOptional, IsString } from "class-validator";

export class CreateCheckpointDto {
  @IsString()
  label!: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}