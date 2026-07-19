import { IsBoolean, IsOptional, IsString } from "class-validator";

export class RestoreWorkspaceDto {
  @IsOptional()
  @IsString()
  checkpointId?: string;

  @IsOptional()
  @IsString()
  snapshotId?: string;

  @IsOptional()
  @IsBoolean()
  approvedByHuman?: boolean;

  @IsOptional()
  @IsString()
  approvedBy?: string;
}