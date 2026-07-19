import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateSnapshotDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
