import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { FactoryArtifactType } from "../contracts/workspace.contracts";

export class CreateArtifactDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsIn([
    "source",
    "configuration",
    "schema",
    "documentation",
    "test",
    "build",
    "package",
    "metadata",
  ])
  type!: FactoryArtifactType;

  @IsString()
  @IsNotEmpty()
  relativePath!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
